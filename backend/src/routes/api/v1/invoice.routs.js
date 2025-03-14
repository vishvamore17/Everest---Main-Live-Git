const express = require("express");
const InvoiceController = require("../../../controller/invoice.controller");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post("/invoiceAdd", InvoiceController.invoiceAdd);
router.put("/updateInvoice/:id", InvoiceController.updateInvoice);
router.delete("/deleteInvoice/:id", InvoiceController.deleteInvoice);
router.get("/getAllInvoices", InvoiceController.getAllInvoices); 
router.get("/getInvoice/:id", InvoiceController.getInvoiceById); 
router.get("/getUnpaidInvoices", InvoiceController.getUnpaidInvoices);
router.get("/getPaidInvoices", InvoiceController.getPaidInvoices);
router.post("/sendEmailReminder", upload.array('attachments[]'), InvoiceController.sendEmailReminder); 
router.put("/updateCustomMessage/:id",InvoiceController.updateCustomMessage);
router.get("/getInvoicesByStatus", InvoiceController.getInvoicesByStatus);
router.post('/updateInvoiceStatus',InvoiceController.updateStatus);

module.exports = router;