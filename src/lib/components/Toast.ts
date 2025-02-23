import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showOkToast(text: string) {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

export function showErrorToast(text: string) {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
