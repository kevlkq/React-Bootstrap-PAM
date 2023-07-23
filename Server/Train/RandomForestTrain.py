import pandas as pd
import sys
import time
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
from sklearn.ensemble import RandomForestRegressor
import joblib

csv_file_path = sys.argv[1]
target_column =  sys.argv[2]

df = pd.read_csv(csv_file_path)
x_columns = df.columns.drop(target_column)
x = df[x_columns].values
y = df[target_column].values

sc = MinMaxScaler()
x_scaled = sc.fit_transform(x)
x_train, x_test, y_train, y_test = train_test_split(x_scaled, y, test_size=0.2, random_state=10)


model = RandomForestRegressor(n_jobs=-1, n_estimators=500, min_samples_leaf=1, max_features='sqrt')
model.fit(x_train, y_train)


model_filename = 'random_forest_model.joblib'
model_path = 'models/' + model_filename
joblib.dump(model, model_path)

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
# from sklearn.ensemble import RandomForestRegressor

# csv_file_path = sys.argv[1]
# # target_column = sys.argv[2]
# target_column = 'RUL'

# df = pd.read_csv(csv_file_path)
# x_columns = df.columns.drop(target_column)
# x = df[x_columns].values
# y = df[target_column].values
# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

# sc = MinMaxScaler()
# X_train = sc.fit_transform(X_train)
# X_test = sc.transform(X_test)
# model = RandomForestRegressor(n_jobs=-1,
#                               n_estimators=500,
#                               min_samples_leaf=1,
#                               max_features='sqrt',
#                              ).fit(X_train,y_train)
# end_train = time.time()
# y_predictions = model.predict(X_test)
# end_predict = time.time()

# model_performance = pd.DataFrame(columns=['R2','RMSE', 'time to train','time to predict','total time'])
# start = time.time()
# model_performance.loc['Random Forest'] = [model.score(X_test,y_test),
#                                    mean_squared_error(y_test,y_predictions,squared=False),
#                                    end_train-start,
#                                    end_predict-end_train,
#                                    end_predict-start]

# print('R-squared error: '+ "{:.2%}".format(model.score(X_test,y_test)))
# print('Root Mean Squared Error: '+ "{:.2f}".format(mean_squared_error(y_test,y_predictions,squared=False)))