from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class OCRProvider(ABC):
    @abstractmethod
    def extract_text(self, document_path: str) -> str:
        pass
    
    @abstractmethod
    def extract_pages(self, document_path: str) -> List[Dict[str, Any]]:
        # Returns list of pages with text and coordinates
        pass

class AIProvider(ABC):
    @abstractmethod
    def classify_document(self, text: str) -> Dict[str, Any]:
        """Return dict with document_type and confidence"""
        pass
        
    @abstractmethod
    def extract_fields(self, text: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Extract fields according to the given JSON schema"""
        pass
        
    @abstractmethod
    def compare_documents(self, doc1_text: str, doc2_text: str, fields_to_compare: List[str]) -> Dict[str, Any]:
        """Compare fields across documents and return validation results"""
        pass

class DocumentGenerator(ABC):
    @abstractmethod
    def generate_docx(self, template_path: str, context: Dict[str, Any], output_path: str) -> str:
        pass
        
    @abstractmethod
    def generate_pdf(self, docx_path: str, output_path: str) -> str:
        pass
