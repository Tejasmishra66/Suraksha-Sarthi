async function () {
  // Converts a list of objects into RFC4180-like CSV text.
  if (!rows || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const  = async () => {
    const text = value == null ? "" : String(value);
    if (text.includes(",") || text.includes("\n") || text.includes('"')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escape(row[header])).join(","));
  });

  return lines.join("\n");
}

module.exports = {
  toCsv
};
