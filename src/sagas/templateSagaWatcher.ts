import { fork, all, takeLatest } from 'redux-saga/effects';
import { fetchTemplate, downloadTemplate, sendToPlanoly, fetchAccounts } from './templateSaga';
import { actionTypes } from '../common/constants/actionTypes';

// add here all your watchers
function* watchLoadTemplateRequest() {
  yield takeLatest(actionTypes.FETCH_TEMPLATE_REQUEST_START, fetchTemplate);
}

function* watchDownloadTemplateRequest() {
  yield takeLatest(actionTypes.DOWNLOAD_TEMPLATE, downloadTemplate);
}

function* watchSendToPlanolyRequest() {
  yield takeLatest(actionTypes.SEND_TO_PLANOLY, sendToPlanoly);
}

function* watchFetchAccountsRequest() {
  yield takeLatest(actionTypes.FETCH_ACCOUNTS_START, fetchAccounts);
}

// function* watchFetchSelectedTemplateRequest() {
//   yield takeLatest(actionTypes.FETCH_SELECTED_TEMPLATE_START, fetchTemplate);
// }

// Register all your watchers
export default function* root() {
  yield all([
    fork(watchLoadTemplateRequest),
    fork(watchDownloadTemplateRequest),
    fork(watchSendToPlanolyRequest),
    fork(watchFetchAccountsRequest)
    // fork(watchFetchSelectedTemplateRequest)
  ])
}
