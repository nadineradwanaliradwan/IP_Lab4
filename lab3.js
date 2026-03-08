document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const keys = document.getElementById("keys");

  // If these are null, your HTML ids are wrong OR script isn't loading correctly
  console.log("display:", display);
  console.log("keys:", keys);

  let currentValue = "0";
  let previousValue = null;
  let operator = null;
  let waitingForNext = false;

  function updateDisplay() {
    display.textContent = currentValue;
  }

  function calculate(a, op, b) {
    const x = Number(a);
    const y = Number(b);

    if (op === "+") return x + y;
    if (op === "-") return x - y;
    if (op === "*") return x * y;
    if (op === "/") return y === 0 ? "Error" : x / y;

    return y;
  }

  keys.addEventListener("click", function (e) {
    const button = e.target;
    if (!button.matches("button")) return;

    console.log("clicked:", button.textContent.trim(), button.dataset);

    const number = button.dataset.number;
    const op = button.dataset.operator;
    const action = button.dataset.action;

    // Numbers
    if (number !== undefined) {
      if (currentValue === "Error") return;

      if (waitingForNext) {
        currentValue = number;
        waitingForNext = false;
      } else {
        currentValue = currentValue === "0" ? number : currentValue + number;
      }
      updateDisplay();
      return;
    }

    // Dot
    if (action === "dot") {
      if (currentValue === "Error") return;

      if (waitingForNext) {
        currentValue = "0.";
        waitingForNext = false;
      } else if (!currentValue.includes(".")) {
        currentValue += ".";
      }
      updateDisplay();
      return;
    }

    // Clear
    if (action === "clear") {
      currentValue = "0";
      previousValue = null;
      operator = null;
      waitingForNext = false;
      updateDisplay();
      return;
    }

    // Sign
    if (action === "sign") {
      if (currentValue === "Error") return;

      if (currentValue !== "0") {
        currentValue = currentValue.startsWith("-")
          ? currentValue.slice(1)
          : "-" + currentValue;
        updateDisplay();
      }
      return;
    }

    // Percent
    if (action === "percent") {
      if (currentValue === "Error") return;

      currentValue = String(Number(currentValue) / 100);
      updateDisplay();
      return;
    }

    // Operators
    if (op !== undefined) {
      if (currentValue === "Error") return;

      if (previousValue !== null && operator !== null && !waitingForNext) {
        const result = calculate(previousValue, operator, currentValue);
        currentValue = String(result);
        updateDisplay();

        if (currentValue === "Error") {
          previousValue = null;
          operator = null;
          waitingForNext = true;
          return;
        }

        previousValue = currentValue;
        operator = op;
        waitingForNext = true;
        return;
      }

      previousValue = currentValue;
      operator = op;
      waitingForNext = true;
      return;
    }

    // Equals
    if (action === "equals") {
      if (previousValue === null || operator === null) return;

      const result = calculate(previousValue, operator, currentValue);
      currentValue = String(result);

      previousValue = null;
      operator = null;
      waitingForNext = true;
      updateDisplay();
      return;
    }
  });

  updateDisplay();
});