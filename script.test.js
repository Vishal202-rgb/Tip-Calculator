/**
 * @jest-environment jsdom
 */

describe("Tip Calculator - calculateTotal", () => {
  let billInput;
  let tipInput;
  let totalSpan;
  let btnEl;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="bill" />
      <input type="text" id="tip" />
      <button id="calculate">Calculate</button>
      <span id="total"></span>
    `;

    jest.resetModules();
    require("./script.js");

    billInput = document.getElementById("bill");
    tipInput = document.getElementById("tip");
    totalSpan = document.getElementById("total");
    btnEl = document.getElementById("calculate");
  });

  describe("Normal Calculation Cases", () => {
    it("should calculate correct total with standard integer inputs", () => {
      billInput.value = "100";
      tipInput.value = "15";

      btnEl.click();

      expect(totalSpan.innerText).toBe("115.00");
    });

    it("should calculate correct total with decimal inputs", () => {
      billInput.value = "45.50";
      tipInput.value = "18.5";

      btnEl.click();

      // 45.5 * (1 + 18.5 / 100) = 53.9175 -> 53.92
      expect(totalSpan.innerText).toBe("53.92");
    });

    it("should calculate correct total when tip is 0%", () => {
      billInput.value = "80";
      tipInput.value = "0";

      btnEl.click();

      expect(totalSpan.innerText).toBe("80.00");
    });

    it("should calculate correct total when bill is 0", () => {
      billInput.value = "0";
      tipInput.value = "20";

      btnEl.click();

      expect(totalSpan.innerText).toBe("0.00");
    });
  });

  describe("Edge Cases and Numeric Validation", () => {
    it("should handle empty inputs gracefully without unexpected calculation bugs", () => {
      billInput.value = "";
      tipInput.value = "";

      btnEl.click();

      // Explicit conversion/validation check: empty strings should be handled/validated
      expect(totalSpan.innerText).not.toBe("NaN");
    });

    it("should handle whitespace-only inputs properly", () => {
      billInput.value = "   ";
      tipInput.value = " 10 ";

      btnEl.click();

      expect(totalSpan.innerText).not.toBe("NaN");
    });

    it("should detect non-numeric bill input and avoid displaying NaN", () => {
      billInput.value = "abc";
      tipInput.value = "15";

      btnEl.click();

      expect(totalSpan.innerText).not.toBe("NaN");
    });

    it("should detect non-numeric tip input and avoid displaying NaN", () => {
      billInput.value = "100";
      tipInput.value = "invalid";

      btnEl.click();

      expect(totalSpan.innerText).not.toBe("NaN");
    });

    it("should handle negative bill or tip values appropriately", () => {
      billInput.value = "-50";
      tipInput.value = "10";

      btnEl.click();

      expect(totalSpan.innerText).toBe("-55.00");
    });

    it("should handle very large numeric inputs accurately", () => {
      billInput.value = "1000000";
      tipInput.value = "20";

      btnEl.click();

      expect(totalSpan.innerText).toBe("1200000.00");
    });
  });

  describe("Event Handler Binding", () => {
    it("should update total span when calculate button is clicked", () => {
      billInput.value = "200";
      tipInput.value = "10";

      btnEl.dispatchEvent(new MouseEvent("click"));

      expect(totalSpan.innerText).toBe("220.00");
    });
  });
});