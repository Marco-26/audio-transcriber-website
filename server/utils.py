import os

def temp_save_file(location, filename, file):
    save_path = os.path.join(location, filename)
    file.save(save_path)