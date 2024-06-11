import win32com.client
import os
import sys

current_dir = os.getcwd()
generated_dir = os.path.join(current_dir)

word = win32com.client.Dispatch("Word.Application")
word.visible = False


for filename in os.listdir(generated_dir):
    if filename.endswith(".docx"):  
        input_file = os.path.join(generated_dir, filename)
        output_file = os.path.join(
            generated_dir, filename.replace(".docx", ".pdf")
        )  

        doc = word.Documents.Open(input_file)
        doc.SaveAs(output_file, FileFormat=17)
        doc.Close()

sys.exit(0)
