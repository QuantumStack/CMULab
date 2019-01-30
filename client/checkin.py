import pyqrcode
import getpass
import sys, os
import random

home = os.path.expanduser('~/') 

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

    # Create a Low Error Correcting QR code
    url = pyqrcode.create(url_str, error='L')

    # Print the low error correcting QR code to terminal
    print(url.terminal(quiet_zone=1, module_color='black', background='white'))

    # Create a high error correcting QR code
    url = pyqrcode.create(url_str, error='H')

    # Save high error correcting QR Code as a PNG for bash script to open
    url.png(home + "." + course + 'cmulab.png', scale=12, 
        module_color=[0, 0, 0, 255], background=[0xff, 0xff, 0xff])


if __name__ == "__main__":
    main()

