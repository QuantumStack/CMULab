import pyqrcode
import getpass
import sys
import random

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

    # Print QR Code
    print(url.terminal(quiet_zone=1))

if __name__ == "__main__":
    main()


