import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import sys
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import MinMaxScaler
import json  # Import the json module

model_path = r'C:\Users\luake\Github\React-Bootstrap-PAM\Server\models\knn_model.joblib'
model = joblib.load(model_path)
csv_file_path = sys.argv[1]
output_csv_path = r'C:\Users\luake\Github\React-Bootstrap-PAM\Server\Predictions\predicted_results_KNN.csv'
df = pd.read_csv(csv_file_path)

x_columns = df.columns
x_values = df[x_columns]
min_max = MinMaxScaler()
x_scaled = min_max.fit_transform(x_values)
y_predicted = model.predict(x_scaled)
df['RUL_Prediction'] = y_predicted

output_csv_file_path = 'Predictions/predicted_results_KNN.csv'
df.to_csv(output_csv_file_path, index=False)

# Create a dictionary with the required information
result_data = {
    'modelName': 'KNN',  # Change this to the appropriate model name
    'csvFilePath': output_csv_file_path
}

# Convert the dictionary to a JSON string
result_json = json.dumps(result_data)

# Print the JSON string to stdout
sys.stdout.write(result_json)