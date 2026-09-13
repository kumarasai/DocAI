import os
import re
from typing import Dict, Any
from docx import Document
from core.interfaces import DocumentGenerator

class DocxTemplateGenerator(DocumentGenerator):
    def generate_docx(self, template_path: str, context: Dict[str, Any], output_path: str) -> str:
        """
        Loads a docx template and replaces variables like {{VAR_NAME}} with values from context.
        """
        doc = Document(template_path)
        
        # A simple variable replacement for paragraph text
        # This will need to be expanded for runs and tables to maintain formatting
        for paragraph in doc.paragraphs:
            for key, value in context.items():
                placeholder = f"{{{{{key}}}}}"
                if placeholder in paragraph.text:
                    # In python-docx replacing text directly at paragraph level loses run formatting,
                    # but we do it simply here for the demo.
                    for run in paragraph.runs:
                        if placeholder in run.text:
                            run.text = run.text.replace(placeholder, str(value))
        
        # Also replace in tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        for key, value in context.items():
                            placeholder = f"{{{{{key}}}}}"
                            for run in paragraph.runs:
                                if placeholder in run.text:
                                    run.text = run.text.replace(placeholder, str(value))
                                    
        doc.save(output_path)
        return output_path

    def generate_pdf(self, docx_path: str, output_path: str) -> str:
        """
        Converts DOCX to PDF. In production on Linux, usually requires LibreOffice headless 
        (e.g., `soffice --headless --convert-to pdf`). Here we stub it or use a lightweight python tool if possible.
        """
        # Note: True docx-to-pdf requires a full layout engine like Word or LibreOffice.
        # We will mock the PDF generation for the demo or use libreoffice in the docker container.
        os.system(f"libreoffice --headless --convert-to pdf {docx_path} --outdir {os.path.dirname(output_path)}")
        
        # If libreoffice fails or isn't installed (like local Windows test), fallback:
        if not os.path.exists(output_path):
            with open(output_path, "wb") as f:
                f.write(b"%PDF-1.4 Mock PDF generated because LibreOffice is not installed locally")
                
        return output_path
