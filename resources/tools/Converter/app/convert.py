import os
import sys
import time
import win32com.client
import pythoncom
import gc

def convert_docx_to_pdf_word(docx_path, pdf_path, retries=3):
    """Convert DOCX to PDF using Microsoft Word with improved instance handling."""
    for attempt in range(retries):
        word = None
        doc = None
        try:
            pythoncom.CoInitialize()
            # Use DispatchEx to create a new instance regardless of existing ones
            word = win32com.client.DispatchEx('Word.Application')
            word.Visible = False  # Keep Word hidden
            
            doc = word.Documents.Open(docx_path)
            doc.SaveAs(pdf_path, FileFormat=17)  # PDF format
            print(f"[Word] Successfully converted '{docx_path}'")
            return True
        except Exception as e:
            print(f"[Word] Attempt {attempt + 1} failed: {str(e)}")
            time.sleep(2)  # Wait before retry
        finally:
            # Cleanup in reverse order of creation
            if doc:
                doc.Close(SaveChanges=0)
                del doc
            if word:
                word.Quit()
                del word
            # Release COM resources
            pythoncom.CoUninitialize()
            # Force garbage collection to ensure COM objects are released
            gc.collect()
            # Optional: Force kill any remaining WinWord processes
            # os.system('taskkill /f /im winword.exe 2>nul')
    return False

def convert_docx_to_pdf_wps(docx_path, pdf_path, retries=3):
    """Attempt to convert using WPS Office with retries and graceful cleanup."""
    wps = None
    doc = None
    for attempt in range(retries):
        try:
            # Create an instance of WPS application
            pythoncom.CoInitialize()
            wps = win32com.client.Dispatch('KWPS.Application')
            wps.Visible = False  # Keep WPS hidden
            
            # Open the document
            doc = wps.Documents.Open(docx_path)
            doc.SaveCopyAs(pdf_path)  # Use SaveCopyAs for WPS
            doc.Close()
            doc = None  # Release document reference
            wps.Quit()
            wps = None  # Release WPS application reference
            return True  # Indicate success
        except Exception as e:
            print(f"[WPS] Error on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                print(f"[WPS] Retrying in 2 seconds...")
                time.sleep(2)  # Wait before retrying
            else:
                print(f"[WPS] Failed to convert '{docx_path}' after {retries} attempts.")
        finally:
            if doc:
                doc.Close()
            if wps:
                wps.Quit()
            doc = None
            wps = None
            pythoncom.CoUninitialize()

    return False  # If all attempts fail

def convert_docx_to_pdf(docx_path, pdf_path):
    """Try to convert DOCX to PDF using Word, then WPS if Word fails."""
    print(f"Trying to convert '{docx_path}' to '{pdf_path}' using Microsoft Word...")
    
    if convert_docx_to_pdf_word(docx_path, pdf_path):
        return True  # Conversion successful with Word

    print(f"Trying to convert '{docx_path}' to '{pdf_path}' using WPS Office...")
    return convert_docx_to_pdf_wps(docx_path, pdf_path)

def main(args):
    if len(args) < 3:
        print("Usage: convert.exe <input_folder> <output_folder> <delete_original>")
        return

    input_folder = args[0]
    output_folder = args[1]
    delete_original = args[2].lower() in ('true', '1')

    os.makedirs(output_folder, exist_ok=True)

    for file_name in os.listdir(input_folder):
        if file_name.endswith('.docx'):
            input_docx_path = os.path.join(input_folder, file_name)
            pdf_path = os.path.join(output_folder, f"{os.path.splitext(file_name)[0]}.pdf")

            if convert_docx_to_pdf(input_docx_path, pdf_path):
                print(f"Converted '{input_docx_path}' to '{pdf_path}'")

                if delete_original:
                    os.remove(input_docx_path)
                    print(f"Deleted original file: '{input_docx_path}'")
            else:
                print(f"Skipping file '{input_docx_path}' due to conversion failure.")

if __name__ == "__main__":
    main(sys.argv[1:])
