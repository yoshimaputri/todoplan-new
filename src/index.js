import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import urlBase64ToUint8Array from './tools';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

navigator.serviceWorker.register('service-worker.js')
navigator.serviceWorker.ready.then(function (registration) {
  return registration.pushManager.getSubscription().then(async function (subscription) {
    if (subscription) {
      return subscription
    }

    const vapidPublicKey = await fetch('http://localhost:3001/vapidPublicKey').then((res) => res.text())
    console.log(vapidPublicKey)
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
    console.log(convertedVapidKey)

    let subs = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    })

    return fetch('http://localhost:3001/subscribe', {
      method: 'POST',
      body: JSON.stringify(subs),
      headers: {
        'content-type': 'application/json'
      }
    })
  })
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
