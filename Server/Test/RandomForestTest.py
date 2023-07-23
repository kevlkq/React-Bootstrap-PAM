from sklearn.ensemble import RandomForestRegressor
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import sys
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler

model_path = 'models/random_forest_model.joblib'
model = joblib.load(model_path)

csv_file_path = sys.argv[1]
df = pd.read_csv(csv_file_path)

target_column = sys.argv[2]
x_columns = df.columns.drop(target_column)
x = df[x_columns]
y = df[target_column]

sc = MinMaxScaler()
x_scaled = sc.fit_transform(x)
x_train, x_test, y_train, y_test = train_test_split(x_scaled, y, test_size=0.2, random_state=10)

y_predictions = model.predict(x_test)

r2 = r2_score(y_test, y_predictions)
rmse = mean_squared_error(y_test, y_predictions, squared=False)

print(r2)
print(rmse)

