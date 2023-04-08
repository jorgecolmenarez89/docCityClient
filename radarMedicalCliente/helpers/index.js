export const validateEmail = value => {
    const validEmailReg =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    return validEmailReg.test(value)
}