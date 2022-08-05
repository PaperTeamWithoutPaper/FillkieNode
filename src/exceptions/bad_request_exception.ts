/**
 * BadRequestException
 */
export default class BadRequestException {
    type = 'BadRequestException';
    message!: string;

    /**
     * Constructor
     * @param {string} message message
     */
    constructor(message: string) {
        this.message = message;
    }
}
