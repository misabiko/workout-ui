import {google} from 'googleapis';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SPREADSHEET_ID } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const sheets = google.sheets({
		version: 'v4',
		auth: new google.auth.GoogleAuth({
			scopes: ['https://www.googleapis.com/auth/spreadsheets']
		})
	});

	const datesWithNotesReponse = await sheets.spreadsheets.values.batchGet({
		spreadsheetId: SPREADSHEET_ID,
		ranges: [
			'Log!A:A',
			'Log!F:F',
		],
	});

	if (!datesWithNotesReponse.data.valueRanges || !datesWithNotesReponse.data.valueRanges[0].values || !datesWithNotesReponse.data.valueRanges[1].values)
		error(500, 'Failed database date request.');

	const today = (new Date()).toLocaleDateString('en-US');
	let todayIndex = -1;
	let newTodayIndex = -1;

	const datesWithNotes = [];
	for (let i = 0; i < datesWithNotesReponse.data.valueRanges[0].values.length; ++i) {
		if (datesWithNotesReponse.data.valueRanges[0].values[i].length === 0)
			continue;

		const date = datesWithNotesReponse.data.valueRanges[0].values[i][0];
		datesWithNotes.push({
			date,
			notes: datesWithNotesReponse.data.valueRanges[1].values.slice(i, i + 7).map((row) => row[0] || null),
		});

		if (date === today) {
			todayIndex = i;
			newTodayIndex = datesWithNotes.length - 1;
		}
	}

	if (todayIndex === -1)
		error(500, `Failed database request for date '${today}'`);

	const currentDayResponse = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: `Log!B${todayIndex + 1}:F${todayIndex + 7}`,
	});

	if (!currentDayResponse.data.values)
		error(500, `Failed database request for date '${today}'`);

	return {
		date: today,
		currentDay: currentDayResponse.data.values as string[][],
		datesWithNotes: datesWithNotes as { date: string, notes: (string | null)[] }[],
		todayIndex: newTodayIndex,
		spreadsheetId: SPREADSHEET_ID,
	};
};

export const ssr = false;