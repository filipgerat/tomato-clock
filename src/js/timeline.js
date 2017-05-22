const STORAGE_KEY = 'timeline';

class Timeline {
	constructor() {
		this.storage = browser.storage.sync || browser.storage.local;
		this.timeline = [];
		this.timelinePromise = this._getTimelinePromise();
	}

	_getTimelinePromise() {
		return new Promise((resolve, reject) => {
			this.storage.get(STORAGE_KEY).then(storageResults => {
				const timeline = storageResults[STORAGE_KEY] || [];

				this.timeline = timeline.map(timelineAlarm => {
					timelineAlarm.date = new Date(timelineAlarm.date);
					return timelineAlarm;
				});

				resolve();
			});
		});
	}

	getTimelinePromise() {
		return this.timelinePromise;
	}

	getTimeline() {
		return this.timeline;
	}

	// Inclusive date range
	getFilteredTimeline(startDate, endDate) {
		return this.timeline.filter(timelineAlarm => {
			return timelineAlarm.date >= startDate && timelineAlarm.date <= endDate;
		});
	}

	addAlarmToTimeline(alarmMinutes) {
		const timeline = this.getTimeline();

		timeline.push({
			timeout: alarmMinutes * 60000,
			date: new Date().toString() // should be initialized to Date whenever interacted with
		});

		this.storage.set({[STORAGE_KEY]: timeline});
	}

	resetTimeline() {
		this.timeline = [];
		this.storage.remove(STORAGE_KEY);
	}
};