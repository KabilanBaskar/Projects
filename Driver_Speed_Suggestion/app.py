from flask import Flask, render_template
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error
import pmdarima as pm
import matplotlib.pyplot as plt
import xgboost as xgb
from sklearn.preprocessing import MinMaxScaler
import warnings
import os

warnings.filterwarnings("ignore")

app = Flask(__name__)

LAT, LON = 13.0827, 80.2707  # Chennai
parameters = ['temp', 'humidity', 'wind_speed', 'clouds', 'pressure']

def generate_synthetic_weather_data():
    data = []
    base_time = datetime.now() - timedelta(hours=3)
    for i in range(180):
        weather = {
            'temp': np.random.uniform(15, 45) + np.random.normal(0, 0.5),
            'humidity': np.random.uniform(10, 100) + np.random.normal(0, 0.5),
            'wind_speed': np.random.uniform(0, 30) + np.random.normal(0, 0.5),
            'clouds': np.random.uniform(0, 100) + np.random.normal(0, 0.5),
            'pressure': np.random.uniform(950, 1050) + np.random.normal(0, 0.5),
            'timestamp': base_time + timedelta(minutes=i)
        }
        data.append(weather)
    df = pd.DataFrame(data)
    df = df.sort_values('timestamp').reset_index(drop=True)
    return df

@app.route('/')
def home():
    df = generate_synthetic_weather_data()
    result_mae = {'Parameter': []}

    if not os.path.exists('static'):
        os.makedirs('static')

    for param in parameters:
        train = df[param][:120]
        test = df[param][120:]

        X_train = df.loc[:119, ['humidity', 'wind_speed', 'clouds', 'pressure']]
        X_test = df.loc[120:, ['humidity', 'wind_speed', 'clouds', 'pressure']]

        result_mae['Parameter'].append(param)

        # Random Forest
        rf = RandomForestRegressor()
        rf.fit(X_train, train)
        rf_pred = rf.predict(X_test)
        result_mae.setdefault('Random Forest', []).append(mean_absolute_error(test, rf_pred))

        # Gradient Boosting
        gb = GradientBoostingRegressor()
        gb.fit(X_train, train)
        gb_pred = gb.predict(X_test)
        result_mae.setdefault('Gradient Boosting', []).append(mean_absolute_error(test, gb_pred))

        # XGBoost
        xgb_model = xgb.XGBRegressor()
        xgb_model.fit(X_train, train)
        xgb_pred = xgb_model.predict(X_test)
        result_mae.setdefault('XGBoosting', []).append(mean_absolute_error(test, xgb_pred))

        # ARIMA
        try:
            arima = pm.auto_arima(train, seasonal=False, stepwise=True)
            arima_pred = arima.predict(len(test))
        except:
            arima_pred = [train.mean()] * len(test)
        result_mae.setdefault('ARIMA', []).append(mean_absolute_error(test, arima_pred))

        # SARIMA
        try:
            sarima = pm.auto_arima(train, seasonal=True, m=4, stepwise=True)
            sarima_pred = sarima.predict(len(test))
        except:
            sarima_pred = [train.mean()] * len(test)
        result_mae.setdefault('SARIMA', []).append(mean_absolute_error(test, sarima_pred))

        # ARIMA + RF
        try:
            arima_rf = pm.auto_arima(rf_pred, seasonal=False, stepwise=True)
            arima_rf_pred = arima_rf.predict(len(test))
        except:
            arima_rf_pred = [rf_pred.mean()] * len(test)
        result_mae.setdefault('ARIMA + RF', []).append(mean_absolute_error(test, arima_rf_pred))

        # SARIMA + RF
        try:
            sarima_rf = pm.auto_arima(rf_pred, seasonal=True, m=4, stepwise=True)
            sarima_rf_pred = sarima_rf.predict(len(test))
        except:
            sarima_rf_pred = [rf_pred.mean()] * len(test)
        result_mae.setdefault('SARIMA + RF', []).append(mean_absolute_error(test, sarima_rf_pred))

        # ARIMA + GB
        try:
            arima_gb = pm.auto_arima(gb_pred, seasonal=False, stepwise=True)
            arima_gb_pred = arima_gb.predict(len(test))
        except:
            arima_gb_pred = [gb_pred.mean()] * len(test)
        result_mae.setdefault('ARIMA + Gradient Boosting', []).append(mean_absolute_error(test, arima_gb_pred))

        # SARIMA + GB
        try:
            sarima_gb = pm.auto_arima(gb_pred, seasonal=True, m=4, stepwise=True)
            sarima_gb_pred = sarima_gb.predict(len(test))
        except:
            sarima_gb_pred = [gb_pred.mean()] * len(test)
        result_mae.setdefault('SARIMA + Gradient Boosting', []).append(mean_absolute_error(test, sarima_gb_pred))

        # ARIMA + XGB
        try:
            arima_xgb = pm.auto_arima(xgb_pred, seasonal=False, stepwise=True)
            arima_xgb_pred = arima_xgb.predict(len(test))
        except:
            arima_xgb_pred = [xgb_pred.mean()] * len(test)
        result_mae.setdefault('ARIMA + XGBoosting', []).append(mean_absolute_error(test, arima_xgb_pred))

        # SARIMA + XGB
        try:
            sarima_xgb = pm.auto_arima(xgb_pred, seasonal=True, m=4, stepwise=True)
            sarima_xgb_pred = sarima_xgb.predict(len(test))
        except:
            sarima_xgb_pred = [xgb_pred.mean()] * len(test)
        result_mae.setdefault('SARIMA + XGBoosting', []).append(mean_absolute_error(test, sarima_xgb_pred))

        # Generate individual graphs
        models = {
            'Random Forest': rf_pred,
            'Gradient Boosting': gb_pred,
            'XGBoosting': xgb_pred,
            'ARIMA': arima_pred,
            'SARIMA': sarima_pred,
            'ARIMA + RF': arima_rf_pred,
            'SARIMA + RF': sarima_rf_pred,
            'ARIMA + Gradient Boosting': arima_gb_pred,
            'SARIMA + Gradient Boosting': sarima_gb_pred,
            'ARIMA + XGBoosting': arima_xgb_pred,
            'SARIMA + XGBoosting': sarima_xgb_pred
        }

        for model_name, predictions in models.items():
            plt.figure(figsize=(10, 5))
            plt.plot(test.index, test.values, label='Actual', linewidth=2)
            plt.plot(test.index, predictions, label=model_name, linestyle='--')
            plt.title(f'{param} - {model_name} Forecast')
            plt.legend(); plt.grid(True)
            plt.savefig(f'static/{param}_{model_name.replace(" ", "_").replace("+", "plus")}.png')
            plt.close()

    mae_df = pd.DataFrame(result_mae)
    mae_df.to_csv('static/mae_table.csv', index=False)

    return render_template('index.html', tables=[mae_df.to_html(classes='table table-bordered', index=False)],
                           titles=mae_df.columns.values, parameters=parameters)

if __name__ == '__main__':
    app.run(debug=True)