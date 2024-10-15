from app import create_app
import signal

app = create_app()

def handle_sigterm(sig, frame):
    print("Received SIGTERM, shutting down Flask server...")
    exit(0)  # Gracefully exit the application

if __name__ == "__main__":
    # Register the signal handler for SIGINT
    signal.signal(signal.SIGINT, handle_sigterm)
    app.run(host="0.0.0.0", port=1216, debug=False)
