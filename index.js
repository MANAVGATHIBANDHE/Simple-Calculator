// Simple Calculator Script
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".button");
  const closeButton = document.querySelector(".fa-regular.fa-circle-xmark");
  const historyButton = document.querySelector(".fa-clock-rotate-left");

  let current = "0";
  let previous = null;
  let operator = null;
  let waitingForNewNumber = false;
  let history = [];

  const historyPanel = document.createElement("div");
  const historyList = document.createElement("div");
  historyPanel.className = "history-panel";
  historyPanel.style.cssText =
    "padding: 10px 10px 10px 0px; text-align: right; max-height: 600px; overflow-y: auto;border: 1px solid #ccc; font-size: 0.9rem; display: none; position: fixed; top: 8rem;z-index: 3;height: 470px; width: 355px; border-radius: 5px; box-shadow: 0 2px 5px rgba(255,255,255,0.9);";
  historyList.className = "history-list";
  historyPanel.appendChild(historyList);
  if (display.parentNode) {
    display.parentNode.insertBefore(historyPanel, display.nextSibling);
  }

  function updateDisplay() {
    display.textContent =
      previous !== null && operator !== null
        ? `${previous} ${operator} ` +
          (current === previous ? "" : `${current}`)
        : current;
  }

  function updateHistoryPanel() {
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No history yet</div>';
      return;
    }
    historyList.innerHTML = history
      .map((entry) => `<div class="history-entry">${entry}</div>`)
      .join("");
  }

  function addHistory(entry) {
    history.unshift(entry);
    if (history.length > 20) {
      history.pop();
    }
    updateHistoryPanel();
  }

  function inputDigit(digit) {
    if (waitingForNewNumber) {
      current = digit;
      waitingForNewNumber = false;
    } else {
      current = current === "0" ? digit : current + digit;
    }
  }

  function inputDecimal() {
    if (waitingForNewNumber) {
      current = "0.";
      waitingForNewNumber = false;
      return;
    }
    if (!current.includes(".")) {
      current += ".";
    }
  }

  function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    waitingForNewNumber = false;
  }

  function deleteLast() {
    if (waitingForNewNumber) return;
    if (
      current.length === 1 ||
      (current.length === 2 && current.startsWith("-"))
    ) {
      current = "0";
    } else {
      current = current.slice(0, -1);
    }
  }

  function performOperation(nextOperator) {
    const inputValue = parseFloat(current);
    if (operator && previous !== null && !waitingForNewNumber) {
      let result = 0;
      const prev = parseFloat(previous);
      switch (operator) {
        case "+":
          result = prev + inputValue;
          break;
        case "-":
          result = prev - inputValue;
          break;
        case "*":
          result = prev * inputValue;
          break;
        case "/":
          result = inputValue === 0 ? "Error" : prev / inputValue;
          break;
        case "%":
          result = inputValue === 0 ? "Error" : prev % inputValue;
          break;
      }
      const expression = `${prev} ${operator} ${inputValue} = ${result}`;
      addHistory(expression);
      current = String(result);
      previous = current === "Error" ? null : String(result);
    } else {
      previous = String(inputValue);
    }
    waitingForNewNumber = true;
    operator = nextOperator;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const buttonContent = button.textContent;

      if (!action) {
        if (buttonContent === ".") {
          inputDecimal();
        } else {
          inputDigit(buttonContent);
        }
        updateDisplay();
        return;
      }

      switch (action) {
        case "clear":
          clearAll();
          updateDisplay();
          break;
        case "delete":
          deleteLast();
          updateDisplay();
          break;
        case "operator":
          performOperation(buttonContent);
          updateDisplay();
          break;
        case "equals":
          performOperation(null);
          operator = null;
          waitingForNewNumber = true;
          updateDisplay();
          break;
      }
    });
  });

  if (historyButton) {
    historyButton.addEventListener("click", () => {
      const isVisible = historyPanel.style.display === "block";
      historyPanel.style.display = isVisible ? "none" : "block";
      if (!isVisible) {
        updateHistoryPanel();
      }
    });
  }

  closeButton.addEventListener("click", () => {
    window.close();
  });

  updateDisplay();
  updateHistoryPanel();
});
