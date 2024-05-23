import path from 'path';
import {google} from "googleapis";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './@types';
import { SPREADSHEET_ID } from '$env/static/private';

export const load: PageServerLoad = async ({params}) => {
	const sheets = google.sheets({
		version: 'v4',
		auth: new google.auth.GoogleAuth({
			scopes: ['https://www.googleapis.com/auth/spreadsheets']
		})
	});

	const datesRes = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: 'Log!A:A',
	});

	const today = (new Date()).toLocaleDateString("en-US");
	const index = datesRes.data.values.findIndex(row => row[0] === today);
	if (index === -1) {
		error(404, 'Not found');
	}

	const dataRes = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: `Log!B${index + 1}:F${index + 7}`,
	});

	return {
		date: today,
		values: dataRes.data.values,
		spreadsheetId: SPREADSHEET_ID,
	};
}