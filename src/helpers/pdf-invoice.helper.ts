// import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import PDFDocumentWithTables from 'pdfkit-table';
import * as puppeteer from 'puppeteer';
// import { JSDOM } from 'jsdom';

const logger = new Logger('PdfHelper');
function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  discount,
  lineTotal,
) {
  doc
    .fontSize(10)
    .text(item, 52, y)
    .text(description, 160, y)
    .text(unitCost, 295, y, { width: 90, align: 'right' })
    .text(discount, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}
function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(49, y).lineTo(541, y).stroke();
}
export class PdfInvoiceHelper {
  async generatePdfPDFKit(expence): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocumentWithTables({
        size: 'letter',
        bufferPages: true,
        autoFirstPage: false,
      });
      doc.addPage({
        margins: {
          top: 50,
          bottom: 50,
          left: 72,
          right: 72,
        },
      });
      // Encabezado =>
      doc
        .image('src/helpers/sih_icono_vQv.png', 50, 55, { width: 120 })
        .fillColor('#444444')
        .fontSize(20)
        .text('Secure Ingress Home', 205, 55, { align: 'right' })
        .fontSize(10)
        .text('Argentina, Bs. As., Calle 123', 205, 80, { align: 'right' })
        .fontSize(10)
        .text('0387-000000', 205, 90, { align: 'right' })
        .fontSize(10)
        .text('sih.corp@gmail.com', 205, 100, { align: 'right' })
        .fontSize(10)
        .text('www.sih.cor.ar', 205, 110, { align: 'right' })
        .moveDown();

      // Linena Separadora =>
      generateHr(doc, 125);
      doc
        .fontSize(12)
        .text('Factura emitida para:', 50, 130)
        .font('Helvetica-Bold')
        .text(
          `${expence.property.user.name} ${expence.property.user.lastName}`,
          50,
          143,
        )
        .font('Helvetica')
        .text(`${expence.property.user.cellphone}`, 50, 158)
        .text(`${expence.property.user.email}`, 50, 169);

      const dateAct = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log(expence);
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(`Factura No.: ${expence.ticket}`, 50, 143, { align: 'right' })
        .fontSize(10)
        .font('Helvetica')
        .text(
          `Fecha de pago: ${expence.datePaid ? expence.datePaid : 'No Pagado'}`,
          50,
          158,
          {
            align: 'right',
          },
        )
        .text(`Fecha de la factura: ${dateAct}`, 50, 169, {
          align: 'right',
        });
      const invoiceTableTop = 200;
      doc.font('Helvetica-Bold');
      generateTableRow(
        doc,
        invoiceTableTop,
        'Item',
        'Description',
        'Unit Costo',
        'Intereses',
        'Costo Total',
      );

      generateHr(doc, invoiceTableTop + 20);
      //   const position = invoiceTableTop * 30;
      doc.font('Helvetica');
      generateTableRow(
        doc,
        230,
        `${expence.typeExpenses}`,
        `${expence.description}`,
        'Cost',
        '',
        `${expence.amount}`,
      );
      doc.font('Helvetica-Bold');
      generateTableRow(doc, 260, '', '', 'Subtotal', '', `${expence.amount}`);
      //   const table = {
      //     headers: ['Item', 'Descripcion', 'Costo'],
      //     rows: [
      //       ['1', 'Servicio', `${expence.amount}`],
      //       ['2', 'IVA', `2`],
      //       ['3', 'Total', `3`],
      //     ],
      //   };

      //   doc.table(table, { columnsSize: [50, 200, 200], y: 200 });

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.on('error', reject);
      doc.end();
    });
    return pdfBuffer;
  }
  async generatePdfJsPDF(): Promise<Buffer> {
    const doc = new jsPDF({ orientation: 'landscape', compress: false });

    const docWidth = doc.internal.pageSize.width;

    const colorBlack = '#000000';
    //starting at 15mm
    const currentHeight = 15;
    //var startPointRectPanel1 = currentHeight + 6;

    const pdfConfig = {
      headerTextSize: 20,
      labelTextSize: 12,
      fieldTextSize: 10,
      lineHeight: 6,
      subLineHeight: 4,
    };

    doc.setFontSize(pdfConfig.headerTextSize);
    doc.setTextColor(colorBlack);
    doc.text('Factura', docWidth - 10, currentHeight, { align: 'right' });
    doc.setFontSize(pdfConfig.fieldTextSize);
    const imageHeader = new Image();
    imageHeader.src = '../SIH-BackEnd-API-Rest/src/helpers/sih_icono_vQv.png';
    doc.addImage(
      '../SIH-BackEnd-API-Rest/src/helpers/sih_icono_vQv.png',
      10,
      10,
      0,
      0,
    );

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return pdfBuffer;
  }

  async geteratePdfPuppeteer() {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
          width: 720,
          height: 500,
          deviceScaleFactor: 1,
          isMobile: true,
          hasTouch: false,
          isLandscape: false,
        },
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      const content = `
       <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
           <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="es">
           <head>
           <meta charset="UTF-8">
           <meta content="width=device-width, initial-scale=1" name="viewport">
           <meta name="x-apple-disable-message-reformatting">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta content="telephone=no" name="format-detection">
           <title>Nueva plantilla</title><!--[if (mso 16)]>
               <style type="text/css">
               a {text-decoration: none;}
               </style>
               <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
           <xml>
               <o:OfficeDocumentSettings>
               <o:AllowPNG></o:AllowPNG>
               <o:PixelsPerInch>96</o:PixelsPerInch>
               </o:OfficeDocumentSettings>
           </xml>
           <![endif]-->
           <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"><!--<![endif]--><!--[if !mso]><!-- -->
           <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"><!--<![endif]-->
           <style type="text/css">
           .rollover:hover .rollover-first {
           max-height:0px!important;
           display:none!important;
           }
           .rollover:hover .rollover-second {
           max-height:none!important;
           display:block!important;
           }
           .rollover span {
           font-size:0px;
           }
           u + .body img ~ div div {
           display:none;
           }
           #outlook a {
           padding:0;
           }
           span.MsoHyperlink,
           span.MsoHyperlinkFollowed {
           color:inherit;
           mso-style-priority:99;
           }
           a.es-button {
           mso-style-priority:100!important;
           text-decoration:none!important;
           }
           a[x-apple-data-detectors] {
           color:inherit!important;
           text-decoration:none!important;
           font-size:inherit!important;
           font-family:inherit!important;
           font-weight:inherit!important;
           line-height:inherit!important;
           }
           .es-desk-hidden {
           display:none;
           float:left;
           overflow:hidden;
           width:0;
           max-height:0;
           line-height:0;
           mso-hide:all;
           }
           .es-button-border:hover > a.es-button {
           color:#ffffff!important;
           }
           @media only screen and (max-width:600px) {*[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:18px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } a.es-button, button.es-button { border-top-width:15px!important; border-bottom-width:15px!important } .img-6348 { height:46px!important } }
           @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
           </style>
           </head>
           <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
           <div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:transparent"><!--[if gte mso 9]>
           <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
           <v:fill type="tile"  color="transparent" origin="0.5, 0" position="0.5, 0"></v:fill>
           </v:background>
           <![endif]-->
           <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:transparent">
               <tr>
               <td valign="top" style="padding:0;Margin:0">
               <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                   <tr>
                   <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#bcb8b1" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                       <tr>
                       <td align="left" bgcolor="#384b59" style="Margin:0;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px;background-color:#384b59">
                       <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                           <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                               <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://sih.com" style="mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:14px"><img src="https://ehpbxyt.stripocdn.email/content/guids/CABINET_bcbf32838e875f8b61c1ef90aa3a3efc6271d6985b67830691e1b887c657ecad/images/sih_icono_vQv.png" alt="" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none" title="Logo" class="adapt-img" width="265"></a></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                   </table></td>
                   </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                   <tr>
                   <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;border-radius:20px 20px 0 0;width:600px" role="none">
                       <tr>
                       <td align="left" style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-top:40px;border-radius:0">
                       <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                           <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                               <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:18px"><img src="https://ehpbxyt.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076323.png" alt="" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none;border-radius:100px" width="100" title="Email de confirmacion"></a></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                       <tr>
                       <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:40px;padding-left:40px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                           <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                           <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafafa" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#fafafa;border-radius:10px" role="presentation">
                               <tr>
                               <td align="left" style="padding:20px;Margin:0"><h3 style="Margin:0;font-family:Imprima, Arial, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:28px;font-style:normal;font-weight:bold;line-height:34px;color:#2D3142">Bienvenido, </h3><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;letter-spacing:0;color:#2D3142;font-size:18px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;letter-spacing:0;color:#2D3142;font-size:18px">Estás recibiendo este mensaje porque recientemente te registraste para obtener una cuenta en SIH. &nbsp;Confirme su cuenta haciendo clic en el botón a continuación.&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;letter-spacing:0;color:#2D3142;font-size:18px">Este paso agrega seguridad adicional a su cuenta al verificar que es el propietario de este correo electrónico.</p></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                   </table></td>
                   </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                   <tr>
                   <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;width:600px">
                       <tr>
                       <td align="left" style="Margin:0;padding-right:40px;padding-left:40px;padding-top:30px;padding-bottom:40px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                           <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                               <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="" target="_blank" hidden>
               <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href=""
                           style="height:51px; v-text-anchor:middle; width:293px" arcsize="50%" stroke="f"  fillcolor="#384b59">
                   <w:anchorlock></w:anchorlock>
                   <center style='color:#ffffff; font-family:Imprima, Arial, sans-serif; font-size:18px; font-weight:700; line-height:18px;  mso-text-raise:1px'>Confirmar Email</center>
               </v:roundrect></a>
           <![endif]--><!--[if !mso]><!-- --><span class="es-button-border msohide" style="border-style:solid;border-color:#2CB543;background:#384b59;border-width:0px;display:block;border-radius:30px;width:auto;mso-hide:all;mso-border-alt:10px"><a href= class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:22px;padding:15px 20px 15px 20px;display:block;background:#384b59;border-radius:30px;font-family:Imprima, Arial, sans-serif;font-weight:bold;font-style:normal;line-height:26px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #384b59;mso-hide:all;padding-left:5px;padding-right:5px;border-color:#7630f3">Confirmar Cuenta</a></span><!--<![endif]--></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                       <tr>
                       <td align="left" style="padding:0;Margin:0;padding-right:40px;padding-left:40px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                           <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                               <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;letter-spacing:0;color:#2D3142;font-size:18px">Muchas gracias,<br><br><strong>Secure Ingress Home</strong></p></td>
                               </tr>
                               <tr>
                               <td align="center" style="padding:0;Margin:0;padding-bottom:20px;padding-top:40px;font-size:0">
                               <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                   <tr>
                                   <td style="padding:0;Margin:0;border-bottom:1px solid #666666;background:unset;height:1px;width:100%;margin:0px"></td>
                                   </tr>
                               </table></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                   </table></td>
                   </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                   <tr>
                   <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;border-radius:0 0 20px 20px;width:600px" role="none">
                       <tr>
                       <td class="esdev-adapt-off" align="left" style="Margin:0;padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px">
                       <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:520px">
                           <tr>
                           <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                           <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                               <tr>
                               <td align="center" valign="top" style="padding:0;Margin:0;width:47px">
                               <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                   <tr>
                                   <td align="center" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:18px"><img src="https://ehpbxyt.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076325.png" alt="Demo" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none" width="47" title="Demo"></a></td>
                                   </tr>
                               </table></td>
                               </tr>
                           </table></td>
                           <td style="padding:0;Margin:0;width:20px"></td>
                           <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                           <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                               <tr>
                               <td align="center" valign="top" style="padding:0;Margin:0;width:453px">
                               <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                   <tr>
                                   <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;letter-spacing:0;color:#2D3142;font-size:18px">Este enlace caduca en 24 horas. Si tienes preguntas, estamos aquí para ayudarte.</p></td>
                                   </tr>
                               </table></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                   </table></td>
                   </tr>
               </table>
               <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                   <tr>
                   <td align="center" style="padding:0;Margin:0">
                   <table bgcolor="#bcb8b1" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                       <tr>
                       <td align="left" style="Margin:0;padding-top:40px;padding-right:20px;padding-bottom:30px;padding-left:20px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                           <td align="left" style="padding:0;Margin:0;width:560px">
                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                               <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><img src="https://ehpbxyt.stripocdn.email/content/guids/CABINET_bcbf32838e875f8b61c1ef90aa3a3efc6271d6985b67830691e1b887c657ecad/images/sih_iconorounded.png" alt="Logo" style="display:block;font-size:12px;border:0;outline:none;text-decoration:none" title="Logo" class="img-6348" height="60"></td>
                               </tr>
                               <tr>
                               <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:20px;padding-top:10px;font-size:0">
                               <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                   <tr>
                                   <td align="center" valign="top" style="padding:0;Margin:0;padding-right:5px"><img src="https://ehpbxyt.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" alt="X" title="X.com" height="24" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none"></td>
                                   <td align="center" valign="top" style="padding:0;Margin:0;padding-right:5px"><img src="https://ehpbxyt.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" title="Facebook" height="24" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none"></td>
                                   <td align="center" valign="top" style="padding:0;Margin:0"><img src="https://ehpbxyt.stripocdn.email/content/assets/img/social-icons/logo-black/linkedin-logo-black.png" alt="In" title="Linkedin" height="24" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none"></td>
                                   </tr>
                               </table></td>
                               </tr>
                               <tr>
                               <td align="center" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#2D3142;font-size:13px"><a target="_blank" style="mso-line-height-rule:exactly;text-decoration:none;color:#2D3142;font-size:14px" href="">&nbsp;• Politica de Privacidad</a> •</p></td>
                               </tr>
                               <tr>
                               <td align="center" style="padding:0;Margin:0;padding-top:20px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#2D3142;font-size:14px">Copyright © 2024 SIH Company</p></td>
                               </tr>
                           </table></td>
                           </tr>
                       </table></td>
                       </tr>
                   </table></td>
                   </tr>
               </table></td>
               </tr>
           </table>
           </div>
           </body>
           </html>
       `;

      await page.setContent(content, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({ format: 'A4' });
      return pdfBuffer;
    } catch (error) {
      logger.error('Error generating PDF', error);
      throw new Error('PDF generation failed');
    }
  }
}

//   await page.goto('https://news.ycombinator.com', {
//     waitUntil: 'networkidle2',
//   });
//   // Saves the PDF to hn.pdf.
//   const pdf = await page.pdf({
//     path: 'hn.pdf',
//   });
//   await browser.close();
