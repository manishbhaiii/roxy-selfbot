// Obfuscated watermark system
const _0x5f2d = [
    'join',
    'split',
    'reverse',
    'map',
    'fromCharCode',
    String.fromCharCode(0x6D) + String.fromCharCode(0x61) + String.fromCharCode(0x64) + String.fromCharCode(0x65) + String.fromCharCode(0x20) + String.fromCharCode(0x62) + String.fromCharCode(0x79) + String.fromCharCode(0x20) + String.fromCharCode(0x69) + String.fromCharCode(0x74) + String.fromCharCode(0x27) + String.fromCharCode(0x73) + String.fromCharCode(0x20) + String.fromCharCode(0x6D) + String.fromCharCode(0x61) + String.fromCharCode(0x6E) + String.fromCharCode(0x69) + String.fromCharCode(0x73) + String.fromCharCode(0x68)
];

const getWatermark = () => {
    try {
        return Buffer.from(_0x5f2d[5], 'utf8')
            .toString('base64')
            .split('')
            .reverse()
            .map(c => String.fromCharCode(c.charCodeAt(0) ^ 1))
            .join('');
    } catch {
        return '';
    }
};

const decodeWatermark = (encoded) => {
    try {
        return Buffer.from(
            encoded
                .split('')
                .map(c => String.fromCharCode(c.charCodeAt(0) ^ 1))
                .reverse()
                .join(''),
            'base64'
        ).toString('utf8');
    } catch {
        return '';
    }
};

module.exports = {
    getSignature: () => decodeWatermark(getWatermark())
}; 