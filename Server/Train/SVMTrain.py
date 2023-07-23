import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
import joblib
import os
import sys
from sklearn.model_selection import train_test_split

csv_file_path = sys.argv[1]
target_column =  sys.argv[2]

df = pd.read_csv(csv_file_path)

x_columns = df.columns.drop(target_column)
x = df[x_columns]
y = df[target_column]
df.dropna(inplace=True)

scaler = StandardScaler()
x_scaled = scaler.fit_transform(x)

x_train, x_test, y_train, y_test = train_test_split(x_scaled, y, test_size=0.2, random_state=1)
svm = SVR()
svm.fit(x_train, y_train)

model_filename = 'svm_model.joblib'
model_path = os.path.join('models', model_filename)
joblib.dump(svm, model_path)




# csv_file_path = sys.argv[1]
# target_column = sys.argv[2]
# # target_column = 'RUL'

# df = pd.read_csv(csv_file_path)


# x_columns = df.columns.drop(target_column)
# x = df[x_columns]
# y = df[target_column]
# df.dropna(inplace=True)

# x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

# scaler = StandardScaler()
# x_train_scaled = scaler.fit_transform(x_train)
# x_test_scaled = scaler.transform(x_test)

# # Use to compare
# # minmax_scaler = MinMaxScaler()
# # x_train_scaled_minmax = minmax_scaler.fit_transform(x_train)
# # x_test_scaled_minmax = minmax_scaler.transform(x_test)

# svm = SVR()
# svm.fit(x_train_scaled, y_train)
# y_pred = svm.predict(x_test_scaled)

# mse = mean_squared_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred)

# print(mse)
# print(r2)
