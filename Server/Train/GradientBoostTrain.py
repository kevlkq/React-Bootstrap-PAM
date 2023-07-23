import pandas as pd
import sys
import time
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
import joblib

csv_file_path = sys.argv[1]
target_column =  sys.argv[2]

df = pd.read_csv(csv_file_path)
x_columns = df.columns.drop(target_column)
x = df[x_columns].values
y = df[target_column].values

X_train, _, y_train, _ = train_test_split(x, y, test_size=0.2)

start = time.time()
model = GradientBoostingRegressor()
model.fit(X_train, y_train)
end_train = time.time()

end_predict = time.time()

model_performance = pd.DataFrame(columns=['R2', 'RMSE', 'time to train', 'time to predict', 'total time'])
model_performance.loc['Gradient boosting'] = [model.score(X_train, y_train),
                                              mean_squared_error(y_train, model.predict(X_train), squared=False),
                                              end_train - start,
                                              end_predict - end_train,
                                              end_predict - start]

model_filename = 'gradient_boosting_model.joblib'
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
# from sklearn.ensemble import GradientBoostingRegressor
# csv_file_path = sys.argv[1]
# # target_column = sys.argv[2]
# target_column = 'RUL'

# df = pd.read_csv(csv_file_path)
# x_columns = df.columns.drop(target_column)
# x = df[x_columns].values
# y = df[target_column].values

# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2)


# start = time.time()
# model=GradientBoostingRegressor()
# model.fit(X_train, y_train)
# end_train = time.time()
# y_predictions = model.predict(X_test)

# end_predict = time.time()
# model_performance = pd.DataFrame(columns=['R2','RMSE', 'time to train','time to predict','total time'])
# model_performance.loc['Gradient boosting'] = [model.score(X_test,y_test),
#                                    mean_squared_error(y_test,y_predictions,squared=False),
#                                    end_train-start,
#                                    end_predict-end_train,
#                                    end_predict-start]

# print('R-squared error: '+ "{:.2%}".format(model.score(X_test,y_test)))
# print('Root Mean Squared Error: '+ "{:.2f}".format(mean_squared_error(y_test,y_predictions,squared=False)))