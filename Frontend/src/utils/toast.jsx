import { toast } from 'react-toastify'
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'

const ICON_SIZE = 20

export function notifySuccess(message) {
  toast.success(message, { icon: <FiCheckCircle size={ICON_SIZE} /> })
}

export function notifyError(message) {
  toast.error(message, { icon: <FiXCircle size={ICON_SIZE} /> })
}

export function notifyInfo(message) {
  toast.info(message, { icon: <FiInfo size={ICON_SIZE} /> })
}

export function notifyWarning(message) {
  toast.warning(message, { icon: <FiAlertTriangle size={ICON_SIZE} /> })
}
