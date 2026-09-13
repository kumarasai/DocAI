from typing import List, Dict, Any
from .interfaces import OCRProvider, AIProvider, DocumentGenerator
import json
import os
import boto3

class PaddleOCRProvider(OCRProvider):
    def __init__(self):
        # We initialize it locally or via API if it's hosted
        from paddleocr import PaddleOCR
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en')

    def extract_text(self, document_path: str) -> str:
        result = self.ocr.ocr(document_path, cls=True)
        text_lines = []
        if result and result[0]:
            for line in result[0]:
                text_lines.append(line[1][0])
        return "\n".join(text_lines)

    def extract_pages(self, document_path: str) -> List[Dict[str, Any]]:
        # A more detailed extraction returning bounding boxes and pages
        # PyMuPDF would be used to split PDF into images first, then run OCR
        pass

class GeminiProvider(AIProvider):
    def __init__(self, api_key: str):
        from google import genai
        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-3.1-pro"

    def classify_document(self, text: str) -> Dict[str, Any]:
        prompt = f"""
        Classify this property document. Options: Aadhaar, PAN, Sale Deed, Sale Agreement, Encumbrance Certificate, Property Tax Receipt, Approved Building Plan, Possession Certificate, Occupancy Certificate, Affidavit, Declaration, Undertaking, Other.
        Return ONLY a JSON object with:
        {{"document_type": "type_snake_case", "confidence": 0.95, "reason": "why"}}
        
        Document Text:
        {text[:5000]}
        """
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        try:
            return json.loads(response.text.strip('```json\n').strip('```'))
        except:
            return {"document_type": "other", "confidence": 0.0, "reason": "Failed to parse API response"}

    def extract_fields(self, text: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Extract the following fields from the document text. Return ONLY a JSON object matching the provided schema exactly. Do not invent any values. If a value is missing, return null.
        
        Schema:
        {json.dumps(schema)}
        
        Document Text:
        {text[:10000]}
        """
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        try:
            return json.loads(response.text.strip('```json\n').strip('```'))
        except:
            return {}

    def compare_documents(self, doc1_text: str, doc2_text: str, fields_to_compare: List[str]) -> Dict[str, Any]:
        pass

class MinioStorageProvider:
    def __init__(self, endpoint: str, access_key: str, secret_key: str):
        self.s3 = boto3.client(
            's3',
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )
    
    def get_presigned_url(self, bucket: str, object_name: str, expiration=3600):
        return self.s3.generate_presigned_url('get_object',
                                              Params={'Bucket': bucket,
                                                      'Key': object_name},
                                              ExpiresIn=expiration)

    def upload_file(self, file_path: str, bucket: str, object_name: str):
        self.s3.upload_file(file_path, bucket, object_name)
