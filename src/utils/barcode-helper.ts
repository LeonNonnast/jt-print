export class BarcodeHelper {
  /**
   * encode text to code 128
   * use converted text to display scanable barcode with libre code 128.tff font
   *
   * @param {string} text to convert
   * @param {string} codeABC
   * Code 128 A: Teilweiser ASCII Satz, keine Kleinbuchstaben aber ASCII Steuerzeichen (TAB, CR/LF usw.)
   * Code 128 B: Kompletter ASCII Satz, keine Steuerzeichen
   * Code 128 C: Ziffern 0-9, paarweise verschlüsselt, sehr kompakter Code
   * @return {string} converted code
   * @memberof BarcodeHelper
   */
  public static encodeToCode128(text, codeABC = 'B') {
    const startCode = String.fromCharCode(
      codeABC.toUpperCase().charCodeAt(0) + 138,
    );
    const stopCode = String.fromCharCode(206);

    text = (codeABC == 'C' && this.toSetC(text)) || text;

    const check = this.checkSum128(text, startCode.charCodeAt(0) - 100);

    text = text.replace(' ', String.fromCharCode(194));

    return startCode + text + check + stopCode;
  }

  private static toSetC(text) {
    return text
      .match(/\d{2}/g)
      .map((ascii, index) => {
        const codeC = Number(ascii);
        const charCode = codeC > 94 ? codeC + 100 : codeC + 32;
        return String.fromCharCode(charCode);
      })
      .join('');
  }

  private static checkSum128(data, startCode) {
    let sum = startCode;
    for (let i = 0; i < data.length; i++) {
      const code = data.charCodeAt(i);
      const value = code > 199 ? code - 100 : code - 32;
      sum += (i + 1) * value;
    }

    let checksum = (sum % 103) + 32;
    if (checksum > 126) checksum = checksum + 68;
    return String.fromCharCode(checksum);
  }
}
