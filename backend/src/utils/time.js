export const parseDurationToSeconds = (duration) => {
    const value = parseInt(duration);
    const unit = duration.replace(value, '');
    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 24 * 60 * 60;
        default: return 0;
    }
};