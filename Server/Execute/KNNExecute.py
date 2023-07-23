import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import sys
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import MinMaxScaler

model_path = r'C:\Users\luake\Github\React_PAM\Server\models\knn_model.joblib'
model = joblib.load(model_path)
csv_file_path = sys.argv[1]
output_csv_path = r'C:\Users\luake\Github\React_PAM\Server\Predictions\predicted_results_KNN.csv'
df = pd.read_csv(csv_file_path)

x_columns = df.columns
x_values = df[x_columns]
min_max = MinMaxScaler()
x_scaled = min_max.fit_transform(x_values)
y_predicted = model.predict(x_scaled)
df['RUL_Prediction'] = y_predicted

output_csv_file_path = 'Predictions/predicted_results_KNN.csv'
df.to_csv(output_csv_file_path, index=False)

print("Predictions saved to predicted_results_KNN.csv")

# import numpy as np
# import pandas as pd
# import sys
# import seaborn as sns
# import matplotlib.pyplot as plt

# from sklearn import neighbors
# from math import sqrt
# import matplotlib.pyplot as plt
# from sklearn.preprocessing import StandardScaler
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.neighbors import KNeighborsRegressor
# from sklearn.svm import SVR
# from sklearn.model_selection import train_test_split
# from sklearn.model_selection import GridSearchCV
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from sklearn.feature_selection import SelectKBest, f_regression
# from sklearn.neighbors import KNeighborsRegressor
# from sklearn.metrics import mean_squared_error, r2_score

# import pandas as pd
# import joblib
# import os
# import sys
# import pandas as pd
# import sys
# from sklearn.preprocessing import MinMaxScaler

# x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

# scaler = StandardScaler()
# x_train_scaled = scaler.fit_transform(x_train)
# x_test_scaled = scaler.transform(x_test)

# selector = SelectKBest(f_regression, k=10)
# x_train_selected = selector.fit_transform(x_train_scaled, y_train)
# x_test_selected = selector.transform(x_test_scaled)

# knn = KNeighborsRegressor(n_neighbors=1)
# knn.fit(x_train_selected, y_train)

# y_pred = knn.predict(x_test_selected)

# mse = mean_squared_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred)

# print(mse)
# print(r2)



