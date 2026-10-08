import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth'
import { getFirebaseAuth } from '@/shared/infrastructure/firebase.config'

export class FirebasePhoneAuthService {
  private static instance: FirebasePhoneAuthService
  private confirmationResult: ConfirmationResult | null = null
  private recaptchaVerifier: RecaptchaVerifier | null = null

  public static getInstance(): FirebasePhoneAuthService {
    if (!FirebasePhoneAuthService.instance) {
      FirebasePhoneAuthService.instance = new FirebasePhoneAuthService()
    }
    return FirebasePhoneAuthService.instance
  }

  /**
   * Inicializa o reutiliza el verificador reCAPTCHA en el elemento indicado
   */
  public setupRecaptcha(
    container: HTMLElement | string,
    onSuccess?: () => void,
    onExpired?: () => void
  ): RecaptchaVerifier {
    const auth = getFirebaseAuth()

    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear()
      } catch {
        // Ignorar si ya fue liberado
      }
      this.recaptchaVerifier = null
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {
        if (onSuccess) onSuccess()
      },
      'expired-callback': () => {
        if (onExpired) onExpired()
      }
    })

    return this.recaptchaVerifier
  }

  /**
   * Envía el código SMS al número indicado (+51...)
   */
  public async sendVerificationCode(
    phoneNumber: string,
    verifier?: RecaptchaVerifier
  ): Promise<ConfirmationResult> {
    const auth = getFirebaseAuth()
    const appVerifier = verifier || this.recaptchaVerifier

    if (!appVerifier) {
      throw new Error('El validador reCAPTCHA no está inicializado.')
    }

    // Asegurarse de que el número comience con código de país '+'
    const formattedNumber = phoneNumber.trim().startsWith('+')
      ? phoneNumber.trim()
      : `+51${phoneNumber.trim().replace(/^0+/, '')}`

    this.confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier)
    return this.confirmationResult
  }

  /**
   * Valida el código recibido por SMS (6 dígitos) y retorna el Firebase ID Token
   */
  public async confirmSmsCode(code: string): Promise<string> {
    if (!this.confirmationResult) {
      throw new Error('No hay ninguna solicitud de verificación SMS pendiente.')
    }

    const userCredential = await this.confirmationResult.confirm(code.trim())
    const idToken = await userCredential.user.getIdToken(true)
    return idToken
  }

  /**
   * Limpia los recursos de reCAPTCHA
   */
  public clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear()
      } catch {
        // Ignore
      }
      this.recaptchaVerifier = null
    }
    this.confirmationResult = null
  }
}

export const firebasePhoneAuthService = FirebasePhoneAuthService.getInstance()
