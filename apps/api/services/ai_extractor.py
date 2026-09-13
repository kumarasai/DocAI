import json
import os
import re
from google import genai
from google.genai import types
from core.config import settings

class AIExtractorService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def extract_fields(self, file_path: str, required_fields: list[str]) -> dict:
        """
        Uses Gemini Native File API to extract required fields from documents (PDF/Images).
        Returns a dict of field names to extracted values.
        """
        if not self.client:
            print("WARNING: Gemini API Key not found. Using mock extraction.")
            return {
                field: f"Mock Data for {field}" for field in required_fields
            }

        prompt = f"""
        You are an expert legal document analyzer.
        Read the provided document and find the information for the specific requested fields.
        
        CRITICAL RULES FOR EXTRACTION:
        1. MAXIMUM EXTRACTION (AVOID "NOT FOUND"): You must do everything in your power to locate the requested fields. Only return "NOT FOUND" if the information is completely missing from the document. If you can deduce the answer from context (e.g. splitting a full name into first/last, or finding a location without exact explicit labels), DO SO.
        2. VERBATIM WHEN POSSIBLE: When you find the information, extract the value as verbatim as possible. Do not fix grammar or spelling.
        3. REGIONAL LANGUAGES (e.g., Telugu): If the document is in a regional language, but the requested fields imply English output, you MUST translate the extracted values into English.
        4. SPECIFIC NUMBER FORMATTING: When extracting monetary amounts, if asked for the number, extract just the number (e.g. "2,18,00,000" from "Rs. 2,18,00,000/-"). If asked for words, extract just the words.
        
        Requested Fields:
        {json.dumps(required_fields)}
        
        Return ONLY a JSON object where keys are exactly the requested fields, and values are the extracted strings.
        """

        import time
        import traceback
        uploaded_file = None
        try:
            print(f"Uploading file to Gemini: {file_path}")
            uploaded_file = self.client.files.upload(file=file_path)
            
            # Wait for file to be ready
            print("Waiting for file processing...", end="", flush=True)
            max_retries = 60 # 60 * 2 = 120 seconds
            retries = 0
            while uploaded_file.state.name == "PROCESSING" and retries < max_retries:
                print(".", end="", flush=True)
                time.sleep(2)
                uploaded_file = self.client.files.get(name=uploaded_file.name)
                retries += 1
            print(" Done!")
                
            if uploaded_file.state.name == "FAILED":
                raise Exception("Document processing failed on Gemini servers.")
            if uploaded_file.state.name == "PROCESSING":
                raise Exception("Document processing timed out on Gemini servers.")
            
            print("Generating content...")
            max_api_retries = 3
            api_retries = 0
            base_delay = 2
            
            response = None
            while api_retries < max_api_retries:
                try:
                    response = self.client.models.generate_content(
                        model='gemini-3.8-flash',
                        contents=[prompt, uploaded_file],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                        ),
                    )
                    break # Success!
                except Exception as api_e:
                    if "503" in str(api_e) or "429" in str(api_e):
                        api_retries += 1
                        if api_retries >= max_api_retries:
                            raise api_e
                        
                        sleep_time = base_delay * (2 ** (api_retries - 1))
                        print(f"API busy (503/429), retrying in {sleep_time}s... ({api_retries}/{max_api_retries})")
                        time.sleep(sleep_time)
                    else:
                        raise api_e

            extracted_data = json.loads(response.text)
            
            def sanitize_extracted_value(val):
                if not isinstance(val, str):
                    return val
                val = val.strip()
                
                # Strip trailing punctuation bleed FIRST so word-match regexes don't fail
                val = re.sub(r'[.,;:]+$', '', val).strip()
                
                # Strip monetary prefixes/suffixes
                val = re.sub(r'^Rs\.?\s*', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s*/-\s*$', '', val)
                val = re.sub(r'^\(?(?:Rupees)\s+', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+only\)?$', '', val, flags=re.IGNORECASE)
                
                # Strip specific string prefixes
                val = re.sub(r'^D\.No\.?\s*', '', val, flags=re.IGNORECASE)
                val = re.sub(r'^Regd\.?\s*', '', val, flags=re.IGNORECASE)
                val = re.sub(r'^S\.R\.O\.?\s*', '', val, flags=re.IGNORECASE)
                val = re.sub(r'^L\.\s*P\.\s*No\.?\s*', '', val, flags=re.IGNORECASE)
                
                # Strip context suffixes (template bleed)
                val = re.sub(r'\s+years?\s*(old)?$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+yrs\.?$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+Sub[-\s]District$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+District$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s*Municipal\s+Corporation$', '', val, flags=re.IGNORECASE)
                
                # Strip measurement context suffixes
                val = re.sub(r'\s+sq\.?\s*yds\.?$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+sq\.?\s*mts\.?$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+square\s+yards?$', '', val, flags=re.IGNORECASE)
                val = re.sub(r'\s+square\s+meters?$', '', val, flags=re.IGNORECASE)
                
                # Strip trailing punctuation AGAIN just in case a stripped suffix exposed a new period
                val = re.sub(r'[.,;:]+$', '', val).strip()
                
                # Normalize Acronyms (remove internal spaces, e.g. V.G.T. UDA -> V.G.T.UDA)
                val = re.sub(r'(?<=[A-Z]\.)\s+(?=[A-Z])', '', val)
                
                return val.strip()

            # Ensure all required fields exist in response and sanitize them
            for field in required_fields:
                if field not in extracted_data:
                    extracted_data[field] = "NOT FOUND"
                else:
                    extracted_data[field] = sanitize_extracted_value(extracted_data[field])
                    
            return extracted_data
            
        except Exception as e:
            err_msg = f"Error calling Gemini: {e}\n{traceback.format_exc()}"
            print(err_msg)
            with open("error_log.txt", "a") as f:
                f.write(err_msg + "\n---\n")
            
            # If it's a 503 or 429 error, let the user know specifically
            error_str = str(e).upper()
            if "503" in error_str or "UNAVAILABLE" in error_str:
                return {field: "Google API Overloaded" for field in required_fields}
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "QUOTA" in error_str:
                return {field: "API Quota Exceeded" for field in required_fields}
                
            return {field: "AI Extraction Error" for field in required_fields}
        finally:
            if uploaded_file:
                try:
                    self.client.files.delete(name=uploaded_file.name)
                except Exception as e:
                    print(f"Error cleaning up Gemini file: {e}")
