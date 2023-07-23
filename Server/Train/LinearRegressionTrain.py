import pandas as pd
import sys
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib
import os
import sys


csv_file_path = sys.argv[1]
target_column =  sys.argv[2]


df = pd.read_csv(csv_file_path)

x_columns = df.columns.drop(target_column)
x = df[x_columns]
y = df[target_column]
df.dropna(inplace=True)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=10)

model = LinearRegression()
model.fit(x_train, y_train)

model_filename = 'LinearRegression_model.joblib'
model_path = os.path.join('models', model_filename)
joblib.dump(model, model_path)

# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import mean_squared_error, r2_score
# import sys
# import time
# import joblib

# csv_file_path = sys.argv[1]
# # target_column = sys.argv[2]
# target_column = 'RUL'

# df = pd.read_csv(csv_file_path)
# df.dropna(inplace=True)

# X_columns = df.columns.drop(target_column)
# y = df[target_column]

# X = df[X_columns]
# y = df[target_column]

# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)

# start = time.time()
# model = LinearRegression().fit(X_train, y_train)
# end_train = time.time()
# y_predictions = model.predict(X_test)

# end_predict = time.time()

# model_performance = pd.DataFrame(columns=['R2', 'RMSE', 'time to train', 'time to predict', 'total time'])
# model_performance.loc['Linear regression'] = [model.score(X_test, y_test),
#                                               mean_squared_error(y_test, y_predictions, squared=False),
#                                               end_train - start,
#                                               end_predict - end_train,
#                                               end_predict - start]

# print('R-squared error: '+ "{:.2%}".format(model.score(X_test,y_test)))
# print('Root Mean Squared Error: '+ "{:.2f}".format(mean_squared_error(y_test,y_predictions,squared=False)))

# model_filename = 'models/linear_regression_model.joblib'
# model_path = sys.path[0] + '/' + model_filename
# joblib.dump(model, model_path)


