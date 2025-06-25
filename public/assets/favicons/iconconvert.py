from PIL import Image
import os

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
png_path = os.path.join(script_dir, "favicon.png")

img = Image.open(png_path)
img.save(os.path.join(script_dir, "favicon.ico"), format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])