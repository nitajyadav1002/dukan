document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".link");
  const forms = document.querySelector(".forms");
  const showHide = document.querySelectorAll(".hide-show");
  const forgetBtn = document.querySelector(".forget-btn");
  showHide.forEach((showicon) => {
    showicon.addEventListener("click", () => {
      let passwordField = showicon.previousElementSibling;

      if (passwordField.type === "password") {
        passwordField.type = "text";
        showicon.classList.replace("bx-hide", "bx-show");
      } else {
        passwordField.type = "password";
        showicon.classList.replace("bx-show", "bx-hide");
      }
    });
  });
  forgetBtn.addEventListener("click", () => {
    window.location.href = "reset-password.html";
  });
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      forms.classList.toggle("Show-Signup");
    });
  });
  const loginForm = document.querySelector(".form.login form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = {
      emailOrPhone: formData.get("emailOrPhone"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (error) {
      console.error("Error during login", error);
      alert("An error occurred. Please try again.");
    }
  });
  const signupForm = document.querySelector(".form.signup form");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const data = {
      emailOrPhone: formData.get("emailOrPhone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Sign up successful! Please log in.");
        window.location.href = "login.html";
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (error) {
      console.error("Error during sign-up", error);
      alert("An error occurred. Please try again.");
    }
  });
});
