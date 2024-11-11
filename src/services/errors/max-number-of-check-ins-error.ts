export class MaxNumberOfCheckInsError extends Error {
	constructor() {
		super("You have reached the maximum number of check-ins");
	}
}
