import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const pdfService = {
  downloadReceipt: async (receipt) => {
    try {
      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("VibeStore Receipt", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Date: ${new Date(receipt.timestamp).toLocaleString()}`, 14, 30);

      const tableData = receipt.items.map((item) => [
        item.name,
        item.qty,
        `Rs. ${item.subtotal.toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [["Product", "Quantity", "Subtotal"]],
        body: tableData,
        startY: 40,
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 4,
          halign: "center",
          valign: "middle",
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });

      const finalY = doc.lastAutoTable?.finalY || 60;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Total: Rs. ${receipt.total.toFixed(2)}`, 14, finalY + 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Thank you for shopping with VibeStore!", 14, finalY + 25);
      doc.text("We hope to see you again soon.", 14, finalY + 31);

      doc.save(`VibeStore_Receipt_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  },
};
