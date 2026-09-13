document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const successMessage = document.getElementById("booking-success");
  const errorMessage = document.getElementById("booking-error");
  const dateError = document.getElementById("booking-date-error");
  const submitButton = form.querySelector("button[type=submit]");
  const checkinInput = form.querySelector("input[name=checkin]");
  const checkoutInput = form.querySelector("input[name=checkout]");

  const toDateStr = (date) => date.toISOString().slice(0, 10);
  const addDays = (dateStr, days) => {
    const date = new Date(dateStr + "T00:00:00");
    date.setDate(date.getDate() + days);
    return toDateStr(date);
  };

  const today = toDateStr(new Date());
  checkinInput.min = today;
  checkoutInput.min = addDays(today, 1);

  checkinInput.addEventListener("change", () => {
    if (!checkinInput.value) return;
    const minCheckout = addDays(checkinInput.value, 1);
    checkoutInput.min = minCheckout;
    if (checkoutInput.value && checkoutInput.value < minCheckout) {
      checkoutInput.value = minCheckout;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMessage.hidden = true;
    errorMessage.hidden = true;
    dateError.hidden = true;

    if (checkinInput.value < today) {
      dateError.textContent = "Дата заезда не может быть в прошлом.";
      dateError.hidden = false;
      checkinInput.focus();
      return;
    }
    if (checkoutInput.value <= checkinInput.value) {
      dateError.textContent = "Дата выезда должна быть позже даты заезда.";
      dateError.hidden = false;
      checkoutInput.focus();
      return;
    }

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
        checkinInput.min = today;
        checkoutInput.min = addDays(today, 1);
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
