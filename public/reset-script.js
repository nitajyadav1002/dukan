document.addEventListener("DOMContentLoaded", () => {
  const resetPasswordForm = document.querySelector(".reset-password form");

  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(resetPasswordForm);
    const data = {
      emailOrPhone: formData.get("emailOrPhone"),
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmNewPassword"),
    };

    if (data.newPassword !== data.confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Password reset successful");
        window.location.href = "index.html";
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (error) {
      console.error("Error during password reset", error);
      alert("An error occurred. Please try again.");
    }
  });
});
