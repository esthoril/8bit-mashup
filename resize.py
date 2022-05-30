# Script to resize image sprites

from PIL import Image

def resize(file, factor=2):
    im = Image.open(file)
    w, h = im.size
    res = im.resize((w*factor, h*factor))
    res.show()

if __name__ == "__main__":
    resize("src/img/overworldMobs.png")