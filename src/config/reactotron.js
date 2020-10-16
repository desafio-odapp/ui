import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

if (process.env.NODE_ENV !== 'production') {
  Reactotron.configure({
    name: 'Desafio Odapp',
  })
    .use(reactotronRedux())
    .use(sagaPlugin())
    .connect()
    .clear();

  console.tron = Reactotron;
}
