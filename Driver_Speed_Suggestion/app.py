from flask import Flask, render_template
import requests
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error
import pmdarima as pm
import matplotlib.pyplot as plt
from prophet import Prophet
import xgboost as xgb
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.callbacks import EarlyStopping
import warnings
import seaborn as sns


warnings.filterwarnings("ignore")

app = Flask(__name__)

OPENWEATHER_API_KEY = 'ef5aee1517d5c436652158ca57317a01'
LAT, LON = 13.0827, 80.2707  # Chennai
parameters = ['temp', 'humidity', 'wind_speed', 'clouds', 'pressure']

def get_weather(lat, lon, api_key):
    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'
    response = requests.get(url).json()
    weather = {
        'temp': response['main']['temp'],
        'humidity': response['main']['humidity'],
        'wind_speed': response['wind']['speed'],
        'clouds': response['clouds']['all'],
        'timestamp': datetime.now(),
        'pressure': response['main']['pressure'],
    }
    return weather

@app.route('/')
def home():
    data = []
    for _ in range(60):
        weather = get_weather(LAT, LON, OPENWEATHER_API_KEY)
        for key in parameters:
            weather[key] += np.random.normal(0, 0.2)
        data.append(weather)

    df = pd.DataFrame(data)
    df = df.sort_values('timestamp').reset_index(drop=True)

    for param in parameters:
        train = df[param][:45]
        test = df[param][45:]
        maes = {}

        # ARIMA
        try:
            arima_model = pm.auto_arima(train, seasonal=False, stepwise=True, suppress_warnings=True)
            arima_pred = arima_model.predict(len(test))
        except:
            arima_pred = [train.mean()] * len(test)
        maes['ARIMA'] = mean_absolute_error(test, arima_pred)

        plt.figure()
        plt.plot(test.index, test.values, label='Actual')
        plt.plot(test.index, arima_pred, label='ARIMA')
        plt.title(f'{param} - ARIMA')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_arima.png'); plt.close()

        # SARIMA
        try:
            sarima_model = pm.auto_arima(train, seasonal=True, m=4, stepwise=True, suppress_warnings=True)
            sarima_pred = sarima_model.predict(len(test))
        except:
            sarima_pred = [train.mean()] * len(test)
        maes['SARIMA'] = mean_absolute_error(test, sarima_pred)

        plt.figure()
        plt.plot(test.index, test.values, label='Actual')
        plt.plot(test.index, sarima_pred, label='SARIMA')
        plt.title(f'{param} - SARIMA')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_sarima.png'); plt.close()

        # RF
        X_train = df.loc[:44, ['humidity', 'wind_speed', 'clouds', 'pressure']]
        y_train = df.loc[:44, param]
        X_test = df.loc[45:, ['humidity', 'wind_speed', 'clouds', 'pressure']]
        y_test = df.loc[45:, param]

        rf = RandomForestRegressor()
        rf.fit(X_train, y_train)
        rf_pred = rf.predict(X_test)
        maes['RF'] = mean_absolute_error(y_test, rf_pred)

        plt.figure()
        plt.plot(y_test.index, y_test.values, label='Actual')
        plt.plot(y_test.index, rf_pred, label='Random Forest')
        plt.title(f'{param} - Random Forest')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_rf.png'); plt.close()

        # GB
        gb = GradientBoostingRegressor()
        gb.fit(X_train, y_train)
        gb_pred = gb.predict(X_test)
        maes['GB'] = mean_absolute_error(y_test, gb_pred)

        plt.figure()
        plt.plot(y_test.index, y_test.values, label='Actual')
        plt.plot(y_test.index, gb_pred, label='Gradient Boosting')
        plt.title(f'{param} - Gradient Boosting')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_gb.png'); plt.close()

        # XGB
        xgb_model = xgb.XGBRegressor()
        xgb_model.fit(X_train, y_train)
        xgb_pred = xgb_model.predict(X_test)
        maes['XGB'] = mean_absolute_error(y_test, xgb_pred)

        plt.figure()
        plt.plot(y_test.index, y_test.values, label='Actual')
        plt.plot(y_test.index, xgb_pred, label='XGBoost')
        plt.title(f'{param} - XGBoost')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_xgb.png'); plt.close()

        # Prophet
        prophet_df = pd.DataFrame({'ds': df['timestamp'][:45], 'y': train.values})
        prophet_model = Prophet()
        prophet_model.fit(prophet_df)
        future = prophet_model.make_future_dataframe(periods=len(test), freq='min')
        forecast = prophet_model.predict(future)
        prophet_pred = forecast['yhat'][-len(test):].values
        maes['Prophet'] = mean_absolute_error(test, prophet_pred)

        plt.figure()
        plt.plot(test.index, test.values, label='Actual')
        plt.plot(test.index, prophet_pred, label='Prophet')
        plt.title(f'{param} - Prophet')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_prophet.png'); plt.close()

        # LSTM
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()
        scaled = scaler.fit_transform(train.values.reshape(-1, 1))
        X_lstm, y_lstm = [], []
        for i in range(3, len(scaled)):
            X_lstm.append(scaled[i-3:i, 0])
            y_lstm.append(scaled[i, 0])
        X_lstm, y_lstm = np.array(X_lstm), np.array(y_lstm)
        X_lstm = X_lstm.reshape((X_lstm.shape[0], X_lstm.shape[1], 1))

        model = Sequential()
        model.add(LSTM(50, activation='relu', input_shape=(X_lstm.shape[1], 1)))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mse')
        model.fit(X_lstm, y_lstm, epochs=20, verbose=0)

        inputs = train.values[-3:].tolist()
        lstm_pred = []
        for _ in range(len(test)):
            last_seq = np.array(inputs[-3:]).reshape((1, 3, 1))
            pred_scaled = model.predict(last_seq, verbose=0)[0][0]
            pred = scaler.inverse_transform([[pred_scaled]])[0][0]
            lstm_pred.append(pred)
            inputs.append(pred)
        maes['LSTM'] = mean_absolute_error(test, lstm_pred)

        plt.figure()
        plt.plot(test.index, test.values, label='Actual')
        plt.plot(test.index, lstm_pred, label='LSTM')
        plt.title(f'{param} - LSTM')
        plt.legend(); plt.grid(True)
        plt.savefig(f'static/{param}_lstm.png'); plt.close()

        ## ✅ Plot MAE Bar Chart
        plt.figure(figsize=(8, 6))
        model_names = list(maes.keys())
        mae_values = list(maes.values())
        plt.bar(model_names, mae_values, color='skyblue')
        plt.title(f'{param.capitalize()} - MAE Comparison Across Models')
        plt.ylabel('Mean Absolute Error (MAE)')
        plt.xlabel('Models')
        plt.grid(axis='y')
        plt.savefig(f'static/{param}_mae_comparison.png')
        plt.close()

    return render_template('index.html', parameters=parameters)



if __name__ == '__main__':
    app.run(debug=True)
