import path from 'path';
import {google} from "googleapis";
import type { PageServerLoad } from './@types';
import { SPREADSHEET_ID } from '$env/static/private';

export const load: PageServerLoad = async ({params}) => {
	const sheets = google.sheets({
		version: 'v4',
		auth: new google.auth.GoogleAuth({
			scopes: ['https://www.googleapis.com/auth/spreadsheets']
		})
	});

	const res = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: 'Log!A:A',
	});

	return {
		values: res.data.values
	};
}