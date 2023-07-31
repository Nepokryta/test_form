export const formatPhoneNumber = (inputValue) => {
    const phoneNumber = inputValue.replace(/\D/g, '');
    const groups = phoneNumber.match(/\d{1,3}/g);

    if (groups && groups.length > 0) {
        groups[0] = `+${groups[0]}`;
    }

    const formattedPhoneNumber = groups ? groups.join(' ') : '';
    return formattedPhoneNumber;
};
