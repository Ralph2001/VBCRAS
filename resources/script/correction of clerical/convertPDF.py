import os
from comtypes.client import CreateObject

def docx_to_pdf(docx_path, pdf_path):
    
  # Create a Word application instance (invisible)
  word = CreateObject('Word.Application')
  word.Visible = False

  # Open the docx file
  try:
    doc = word.Documents.Open(docx_path)
  except Exception as e:
    print(f"Error opening docx file: {e}")
    return

  # Save as PDF
  try:
    doc.ExportAsFixedFormat(pdf_path, 17)  # 17 = wdExportFormatPDF
  except Exception as e:
    print(f"Error converting to PDF: {e}")
  finally:
    # Close the document and quit Word
    doc.Close()
    word.Quit()

# Example usage
docx_file = "your_document.docx"
pdf_file = "converted.pdf"
docx_to_pdf(docx_file, pdf_file)

if os.path.exists(pdf_file):
  print(f"Successfully converted {docx_file} to {pdf_file}")
else:
  print("Conversion failed.")
