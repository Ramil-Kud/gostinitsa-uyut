document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const successMessage = document.getElementById("booking-success");
  const errorMessage = document.getElementById("booking-error");
  const submitButton = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMessage.hidden = true;
    errorMessage.hidden = true;
    submitButton.disabled = true;

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        successMessage.hidden = false;
        form.reset();
      } else {
        errorMessage.hidden = false;
      }
    } catch (err) {
      errorMessage.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
});
