import pyqrcode
import getpass
import sys
import os
import random
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

home = os.path.expanduser('~') + "/" 

def main():
    # Get the student ID of the user from their user directory
    student_id = getpass.getuser()

    # Get course from args
    course = sys.argv[1]
    url = sys.argv[2]

    print("Student ID: " + student_id + " (" + course + ")")
    print("Check-in ID: " + str(random.randint(100000, 999999)))

    # Build URL string for QR
    url_str = (url + '/checkin/' + student_id + '/')

    # Create QR code
    url = pyqrcode.create(url_str, error='L')

    # Create PNG
    url.png(home + course + 'code.png', scale=5, module_color="#000000", background="#FFFFFF")

    # Create Image
    img=mpimg.imread(home + course + 'code.png')
    imgplot = plt.imshow(img)
    plt.show()


    
    # Print QR Code
    print(url.terminal(quiet_zone=1, module_color="black", background="white"))

if __name__ == "__main__":
    main()


