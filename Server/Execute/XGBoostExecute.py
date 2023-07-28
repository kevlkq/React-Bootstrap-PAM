
from xgboost import XGBRegressor
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import sys

model_path = r'C:\Users\luake\Github\React-Bootstrap-PAM\Server\models\xgboost_model.joblib'
model = joblib.load(model_path)
csv_file_path = sys.argv[1]
output_csv_path = r'C:\Users\luake\Github\React-Bootstrap-PAM\Server\Predictions\predicted_results_XGBoost.csv'
df = pd.read_csv(csv_file_path)

x_columns = df.columns
x_values = df[x_columns]
y_predicted = model.predict(x_values)
df['RUL_Prediction'] = y_predicted

output_csv_file_path = 'Predictions/predicted_results_XGBoostExecute.csv'
df.to_csv(output_csv_file_path, index=False)

print("Predictions saved to predicted_results_XGBoostExecute.csv")




# from xgboost import XGBRegressor
# import numpy as np
# import pandas as pd
# from sklearn.model_selection import train_test_split
# import tensorflow as tf
# import time
# import sklearn
# import sys 
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics import mean_absolute_error
# from sklearn.metrics import r2_score
# from sklearn.metrics import mean_squared_error
# from sklearn.ensemble import GradientBoostingRegressor
# start = time.time()
# csv_file_path = sys.argv[1]
# # target_column = sys.argv[2]
# target_column = 'RUL'

# df = pd.read_csv(csv_file_path)
# x_columns = df.columns.drop(target_column)
# x = df[x_columns].values
# y = df[target_column].values
# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2)


# model = XGBRegressor(n_estimators=1000)
# model.fit(X_train, y_train, early_stopping_rounds=5, eval_set=[(X_test, y_test)], verbose=False)
# end_train = time.time()
# y_predictions = model.predict(X_test)
# # These are the predictions from the test data.
# end_predict = time.time()

# model_performance = pd.DataFrame(columns=['R2','RMSE', 'time to train','time to predict','total time'])
# model_performance.loc['XGBoost'] = [model.score(X_test,y_test),
#                                    mean_squared_error(y_test,y_predictions,squared=False),
#                                    end_train-start,
#                                    end_predict-end_train,
#                                    end_predict-start]

# print('R-squared error: '+ "{:.2%}".format(model.score(X_test,y_test)))
# print('Root Mean Squared Error: '+ "{:.2f}".format(mean_squared_error(y_test,y_predictions,squared=False)))