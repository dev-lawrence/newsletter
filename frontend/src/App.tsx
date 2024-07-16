import { ChangeEvent, FormEvent, useState } from 'react';
import successImg from './assets/icon-success.svg';

interface SubscriberDetails {
  email_address: string;
}

const App = () => {
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] =
    useState<SubscriberDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailErrorMessage('Email is required');
    } else {
      const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
      if (!emailRegex.test(email)) {
        setEmailErrorMessage('Invalid email address');
      } else {
        setEmailErrorMessage('');
      }
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  // Handle submit function
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    validateEmail(email);

    if (!email) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/addSubscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setSuccessMessage(null);
        return;
      }

      setSuccessMessage(data.response);
      setErrorMessage('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        throw new Error('There was an unknown error');
      }
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  const dismissMessage = () => {
    setErrorMessage('');
    setSuccessMessage(null);
  };

  return (
    <div className="panel">
      {!(successMessage || errorMessage) && (
        <div className="form-container">
          <div className="img"></div>

          <div className="form-content">
            <div className="content">
              <h1>Stay updated!</h1>
              <p>Join 60,000+ product managers receiving monthly updates on:</p>

              <ul>
                <li>Product discovery and building what matters</li>
                <li>Measuring to ensure updates are a success</li>
                <li>And much more!</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="d-flex">
                <label htmlFor="email">Email Address</label>
                <p>{emailErrorMessage}</p>
              </div>
              <input
                className={`${emailErrorMessage ? 'danger' : ''}`}
                value={email}
                type="text"
                id="email"
                onChange={handleEmailChange}
                placeholder="email@company.com"
              />
              <br />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Subscribe to monthly newsletter'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success and Error template */}
      {(successMessage || errorMessage) && (
        <div className="message">
          <>
            {successMessage ? (
              <div className="success-msg">
                <img src={successImg} alt="" />
                <h2>Thanks for subscribing!</h2>
                <p>
                  A confirmation email has been sent to{' '}
                  <strong>{successMessage.email_address}</strong>
                  Please open it and click the button inside to confirm your
                  subscription.
                </p>
              </div>
            ) : (
              <div className="err-msg">
                <p>
                  You are already added to our waitlist. So stay tuned for more
                  update
                </p>
              </div>
            )}
          </>

          <button onClick={dismissMessage} className="dismiss-btn">
            Dismiss Message
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
