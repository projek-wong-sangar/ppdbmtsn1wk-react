export interface EmailConfig {
  apiKey: string;
  domain: string;
  fromEmail: string;
}

export interface PasswordEmailData {
  to: string;
  nama: string;
  password: string;
  noPendaftaran: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
}

export const emailService = {
  generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    for (let i = 0; i < 5; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  },


  async sendPasswordEmail(data: PasswordEmailData): Promise<EmailResult> {
    try {
      const mailgun = require('mailgun-js')({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      });

      const emailData = {
        from: process.env.MAILGUN_FROM_EMAIL || 'noreply@mtsn1wk.sch.id',
        to: data.to,
        subject: 'Password Login PPDB MTsN 1 Way Kanan',
        html: emailService.generatePasswordEmailTemplate(data)
      };

      const result = await mailgun.messages().send(emailData);
      console.log('Email sent successfully:', result);
      
      return {
        success: true,
        message: 'Email berhasil dikirim',
        messageId: result.id
      };

    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: 'Gagal mengirim email'
      };
    }
  },

  generatePasswordEmailTemplate(data: PasswordEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Login PPDB MTsN 1 Way Kanan</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .password-box { background: #fff; border: 2px solid #2563eb; padding: 15px; text-align: center; margin: 20px 0; }
          .password { font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PPDB MTsN 1 Way Kanan</h1>
            <p>Tahun Pelajaran 2025/2026</p>
          </div>
          
          <div class="content">
            <h2>Selamat ${data.nama}!</h2>
            <p>Pendaftaran Anda telah berhasil dengan nomor pendaftaran:</p>
            <p><strong>${data.noPendaftaran}</strong></p>
            
            <p>Berikut adalah password untuk login ke akun Anda:</p>
            
            <div class="password-box">
              <p>Password Login:</p>
              <div class="password">${data.password}</div>
            </div>
            
            <p><strong>Catatan Penting:</strong></p>
            <ul>
              <li>Password ini bersifat case sensitive (huruf besar/kecil berbeda)</li>
              <li>Simpan password ini dengan baik</li>
              <li>Gunakan password ini untuk login di <a href="https://ppdb.mtsn1wk.sch.id/login">halaman login</a></li>
              <li>Jika lupa password, hubungi admin</li>
            </ul>
            
            <p>Terima kasih telah mendaftar di MTsN 1 Way Kanan!</p>
          </div>
          
          <div class="footer">
            <p>Email ini dikirim secara otomatis, harap tidak membalas email ini.</p>
            <p>MTsN 1 Way Kanan | Jl. Raya Way Kanan, Lampung</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  async sendResetPasswordEmail(data: PasswordEmailData): Promise<EmailResult> {
    try {
      const mailgun = require('mailgun-js')({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      });

      const emailData = {
        from: process.env.MAILGUN_FROM_EMAIL || 'noreply@mtsn1wk.sch.id',
        to: data.to,
        subject: 'Reset Password PPDB MTsN 1 Way Kanan',
        html: emailService.generateResetPasswordEmailTemplate(data)
      };

      const result = await mailgun.messages().send(emailData);
      console.log('Reset password email sent successfully:', result);
      
      return {
        success: true,
        message: 'Email reset password berhasil dikirim',
        messageId: result.id
      };

    } catch (error) {
      console.error('Error sending reset password email:', error);
      return {
        success: false,
        message: 'Gagal mengirim email reset password'
      };
    }
  },

  generateResetPasswordEmailTemplate(data: PasswordEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Password PPDB MTsN 1 Way Kanan</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .password-box { background: #fff; border: 2px solid #dc2626; padding: 15px; text-align: center; margin: 20px 0; }
          .password { font-size: 24px; font-weight: bold; color: #dc2626; letter-spacing: 2px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Password PPDB</h1>
            <p>MTsN 1 Way Kanan</p>
          </div>
          
          <div class="content">
            <h2>Halo ${data.nama}!</h2>
            <p>Anda telah meminta reset password untuk akun dengan nomor pendaftaran:</p>
            <p><strong>${data.noPendaftaran}</strong></p>
            
            <p>Berikut adalah password baru untuk login ke akun Anda:</p>
            
            <div class="password-box">
              <p>Password Baru:</p>
              <div class="password">${data.password}</div>
            </div>
            
            <p><strong>Catatan Penting:</strong></p>
            <ul>
              <li>Password ini bersifat case sensitive (huruf besar/kecil berbeda)</li>
              <li>Simpan password ini dengan baik</li>
              <li>Gunakan password ini untuk login di <a href="https://ppdb.mtsn1wk.sch.id/login">halaman login</a></li>
              <li>Jika tidak meminta reset password, abaikan email ini</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Email ini dikirim secara otomatis, harap tidak membalas email ini.</p>
            <p>MTsN 1 Way Kanan | Jl. Raya Way Kanan, Lampung</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};
