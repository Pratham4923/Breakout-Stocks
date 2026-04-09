const authForm = document.getElementById("auth-form");
const authError = document.getElementById("auth-error");
const authSubmit = document.getElementById("auth-submit");
const authSubmitLabel = document.getElementById("auth-submit-label");
const authPassword = document.getElementById("auth-password");
const faceVideo = document.getElementById("face-video");
const facePreview = document.getElementById("face-preview");
const faceCanvas = document.getElementById("face-canvas");
const faceStartBtn = document.getElementById("face-start-btn");
const faceCaptureBtn = document.getElementById("face-capture-btn");
const faceRetakeBtn = document.getElementById("face-retake-btn");
const faceStatus = document.getElementById("face-status");

let faceStream = null;
let enrolledFaceImage = "";

function setSubmitLabel(text) {
  if (authSubmitLabel) authSubmitLabel.textContent = text;
}

function setFaceStatus(text) {
  if (faceStatus) faceStatus.textContent = text;
}

async function startFaceCamera() {
  if (!faceVideo || !navigator.mediaDevices?.getUserMedia) {
    setFaceStatus("Camera access is not available in this browser.");
    return;
  }

  try {
    faceStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 720 },
        height: { ideal: 540 },
      },
      audio: false,
    });
    faceVideo.srcObject = faceStream;
    if (faceCaptureBtn) faceCaptureBtn.disabled = false;
    setFaceStatus("Camera is live. Keep your face centered and capture one clear frame.");
  } catch {
    setFaceStatus("Camera permission is required to enroll your face during account creation.");
  }
}

function stopFaceCamera() {
  if (faceStream) {
    faceStream.getTracks().forEach((track) => track.stop());
    faceStream = null;
  }
  if (faceVideo) faceVideo.srcObject = null;
}

function captureFace() {
  if (!faceVideo || !faceCanvas || !facePreview) return;
  const width = faceVideo.videoWidth || 720;
  const height = faceVideo.videoHeight || 540;
  if (!width || !height) {
    setFaceStatus("Wait for the camera preview, then capture again.");
    return;
  }

  faceCanvas.width = width;
  faceCanvas.height = height;
  const context = faceCanvas.getContext("2d");
  if (!context) {
    setFaceStatus("Could not prepare the face capture.");
    return;
  }

  context.drawImage(faceVideo, 0, 0, width, height);
  enrolledFaceImage = faceCanvas.toDataURL("image/jpeg", 0.92);
  facePreview.src = enrolledFaceImage;
  facePreview.hidden = false;
  faceVideo.hidden = true;
  if (faceRetakeBtn) faceRetakeBtn.hidden = false;
  if (faceCaptureBtn) faceCaptureBtn.disabled = true;
  stopFaceCamera();
  setFaceStatus("Face enrolled for this account. Retake it if the image is blurry or off-center.");
}

function resetFaceCapture() {
  enrolledFaceImage = "";
  if (facePreview) {
    facePreview.hidden = true;
    facePreview.removeAttribute("src");
  }
  if (faceVideo) faceVideo.hidden = false;
  if (faceRetakeBtn) faceRetakeBtn.hidden = true;
  if (faceCaptureBtn) faceCaptureBtn.disabled = true;
  setFaceStatus("Open the camera and capture a clear front-facing photo so attendance recognition can be enrolled with this account.");
}

async function initAuthPage() {
  const token = localStorage.getItem("astraveda_token");
  if (!token) return;

  try {
    const response = await fetch(`/api/auth/status?token=${encodeURIComponent(token)}`);
    const data = await response.json();
    if (data.authenticated) {
      window.location.href = "/dashboard";
    }
  } catch {
    // stay on page
  }
}

async function submitAuth(event) {
  event.preventDefault();
  authError.textContent = "";

  const mode = authForm.dataset.authMode;
  const password = authPassword.value.trim();
  if (password.length < 6) {
    authError.textContent = "Password must be at least 6 characters.";
    return;
  }

  let endpoint = "/api/auth/login";
  let payload;

  if (mode === "signup") {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    if (!username || !email || !phone) {
      authError.textContent = "Fill in username, email, and phone to create an account.";
      return;
    }
    if (!enrolledFaceImage) {
      authError.textContent = "Capture your face once before creating the account.";
      return;
    }
    endpoint = "/api/auth/register";
    payload = { username, email, phone, password, face_image: enrolledFaceImage };
  } else {
    const identifier = document.getElementById("auth-identifier").value.trim();
    if (!identifier) {
      authError.textContent = "Enter your username, email, or phone number.";
      return;
    }
    payload = { identifier, password };
  }

  if (authSubmit) authSubmit.disabled = true;
  setSubmitLabel(mode === "signup" ? "Creating..." : "Opening...");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.ok) {
      authError.textContent = data.message || "Authentication failed.";
      return;
    }

    localStorage.setItem("astraveda_token", data.token);
    window.location.href = "/dashboard";
  } catch {
    authError.textContent = "The terminal could not reach the auth service. Try again.";
  } finally {
  if (authSubmit) authSubmit.disabled = false;
  setSubmitLabel(mode === "signup" ? "Create account" : "Open terminal");
  }
}

authForm?.addEventListener("submit", submitAuth);
faceStartBtn?.addEventListener("click", startFaceCamera);
faceCaptureBtn?.addEventListener("click", captureFace);
faceRetakeBtn?.addEventListener("click", () => {
  resetFaceCapture();
  startFaceCamera();
});
window.addEventListener("beforeunload", stopFaceCamera);
initAuthPage();

if (typeof lucide !== "undefined") {
  lucide.createIcons();
}
